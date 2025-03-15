import { calcPosition, coordinate2position, coordinate2size, snapOnMove, snapOnResize } from "./utils/item";
import { on } from "svelte/events";
import { getGridContext } from "./utils/GridContext.svelte";
import { getAvailablePosition, getGridDimensions, hasCollisions } from "./utils/grid";
import type { ItemSize, LayoutItem } from "./types";
import type { TabEntity } from "./GridItemTabsState.svelte";
import Grid from "svelte-grid-extended"

export default class {
  active = $state(false);
  left = $state(0);
  top = $state(0);
  width = $state(0);
  height = $state(0);
  initialPointerPosition = $state({ left: 0, top: 0 });
  initialPosition = $state({ left: 0, top: 0 })
  initialSize = $state({ width: 0, height: 0 })
  moveableEl = $state<HTMLElement>()
  entities = $state<TabEntity[]>([])
  activeEntity = $derived(this.entities.find((entity) => entity.active));
  cleanupMoveMouse = $state<null | (() => void)>(null)
  cleanupMoveEndMouse = $state<null | (() => void)>(null)
  cleanupMoveTouch = $state<null | (() => void)>(null)
  cleanupMoveEndTouch = $state<null | (() => void)>(null)
  cleanupResizeMouse = $state<void | (() => void)>()
  cleanupResizeMouseEnd = $state<void | (() => void)>()
  settings = $state(getGridContext())
  minSize: ItemSize = $derived.by(() => {
    return {
      width: coordinate2size(this.item.min.widthGridUnits, this.settings.itemSize.width, this.settings.gap),
      height: coordinate2size(this.item.min.heightGridUnits, this.settings.itemSize.height, this.settings.gap)
    };
  });
  maxSize: ItemSize = $derived.by(() => {
    return {
      width: coordinate2size(
        this.item.max?.widthGridUnits ?? Infinity,
        this.settings.itemSize.width,
        this.settings.gap
      ),
      height: coordinate2size(
        this.item.max?.heightGridUnits ?? Infinity,
        this.settings.itemSize.height,
        this.settings.gap
      )
    }
  })
  item = $state({
    id: "",
    x: 0,
    y: 0,
    heightGridUnits: 0,
    widthGridUnits: 0,
    min: { widthGridUnits: 0, heightGridUnits: 0 },
    moveable: true,
    resizeable: true
  } as LayoutItem)
  previewItem = $state({ ...this.item } as LayoutItem)
  preview = $derived.by(() => {
    return calcPosition(this.previewItem, {
      itemSize: this.settings.itemSize,
      gap: this.settings.gap
    })
  })
  constructor({ item }: { item: LayoutItem }) {
    this.item = item
    this.previewItem = { ...item }
  }
  init() {
    if (!this.active && this.settings.itemSize) {
      const position = calcPosition(this.item, {
        itemSize: this.settings.itemSize,
        gap: this.settings.gap
      })

      this.left = position.left;
      this.top = position.top;
      this.width = position.width;
      this.height = position.height;

      if (this.isOutsideBounds() || hasCollisions(this.item, Object.values(this.settings.items))) {
        let newCoords = this.getFirstAvailableCoords(this.item)
        if (newCoords) {
          this.left = coordinate2position(newCoords.x, this.settings.itemSize.width, this.settings.gap)
          this.top = coordinate2position(newCoords.y, this.settings.itemSize.height, this.settings.gap)
        }
      }
      this.initialPosition = { left: this.left, top: this.top }
    }

    if (!this.active && this.item) {
      this.previewItem = this.item;
    }
  }
  private isOutsideBounds() {
    let rect = this.settings.boundsTo?.getBoundingClientRect()
    if (!rect) return false
    return this.left < rect.left || this.top < rect.top || this.left + this.width > rect.right || this.top + this.height > rect.bottom
  }
  private getFirstAvailableCoords({ widthGridUnits, heightGridUnits }: { widthGridUnits: number, heightGridUnits: number }): {
    x: number;
    y: number;
  } | null {
    // let rect = this.settings.boundsTo?.getBoundingClientRect()
    // if (!rect) return null
    // let maxCols = Math.round(rect.width / (this.settings.itemSize.width + this.settings.gap)) - 1
    // let maxRows = Math.round(rect.height / (this.settings.itemSize.height + this.settings.gap)) - 1
    let dimensions = this.settings.getGridDimensions()
    return getAvailablePosition({
      id: '',
      x: 0,
      y: 0,
      widthGridUnits,
      heightGridUnits,
      min: { widthGridUnits: 32, heightGridUnits: 32 },
      moveable: true,
      resizeable: true,
    }, Object.values(this.settings.items), dimensions.cols, dimensions.rows);
  }

  private applyPreview() {
    this.item.x = this.previewItem.x;
    this.item.y = this.previewItem.y;
    this.item.widthGridUnits = this.previewItem.widthGridUnits;
    this.item.heightGridUnits = this.previewItem.heightGridUnits;
    this.left = this.preview.left;
    this.top = this.preview.top;
    this.width = coordinate2size(this.previewItem.widthGridUnits, this.settings.itemSize.width, this.settings.gap)
    this.height = coordinate2size(this.previewItem.heightGridUnits, this.settings.itemSize.height, this.settings.gap)
  }


  private initInteraction(e: PointerEvent | TouchEvent["touches"][0]) {
    this.active = true;
    this.initialPointerPosition = { left: e.pageX, top: e.pageY }
    if ("pointerId" in e && this.moveableEl) {
      this.moveableEl?.setPointerCapture(e.pointerId)
    }
  }
  private endInteraction(event: PointerEvent | Touch) {
    this.active = false;
    this.applyPreview();
    if ("pointerId" in event) {
      this.moveableEl?.releasePointerCapture(event.pointerId)
    }
    if (this.cleanupMoveMouse) this.cleanupMoveMouse()
    if (this.cleanupMoveEndMouse) this.cleanupMoveEndMouse()
    if (this.cleanupMoveTouch) this.cleanupMoveTouch()
    if (this.cleanupMoveEndTouch) this.cleanupMoveEndTouch()
    if (this.cleanupResizeMouse) this.cleanupResizeMouse()
    if (this.cleanupResizeMouseEnd) this.cleanupResizeMouseEnd()
  }
  moveStartTouch(e: TouchEvent) {
    if (this.active) return
    this.initInteraction(e.touches[0])
    this.initialPosition = { left: this.left, top: this.top }
    this.cleanupMoveTouch = on(window, 'touchmove', (e) => this.move(e.touches[0]))
    this.cleanupMoveEndTouch = on(window, 'touchend', (e) => this.moveEndTouch(e.touches[0]))
  }
  moveStartMouse(event: PointerEvent) {
    if (event.button !== 0 || this.active) return;
    this.initInteraction(event);
    this.initialPosition = { left: this.left, top: this.top }
    this.cleanupMoveMouse = on(window, 'pointermove', (e) => this.move(e));
    this.cleanupMoveEndMouse = on(window, 'pointerup', (e) => this.moveEndMouse(e))
  }
  private move(event: PointerEvent | Touch) {
    if (!this.settings.itemSize) {
      throw new Error('Grid is not mounted yet');
    }
    let _left = event.pageX - this.initialPointerPosition.left + this.initialPosition.left;
    let _top = event.pageY - this.initialPointerPosition.top + this.initialPosition.top;
    if (this.settings.bounds && this.settings.boundsTo) {
      const parentRect = this.settings.boundsTo.getBoundingClientRect();
      _left = Math.max(_left, 0)
      _left = Math.min(_left, parentRect.width - this.width)
      if (_left + this.width > parentRect.width) {
        _left = parentRect.width - this.width - this.settings.gap
      }
      if (_top + this.height > parentRect.height) {
        _top = parentRect.height - this.height
      }
    }
    this.left = _left;
    this.top = _top;
    //TODO: implement scroll
    // scroll();
    console.log(_top)
    const { x, y } = snapOnMove(this.left, this.top, this.previewItem, this.settings);
    if (!hasCollisions({ ...this.previewItem, x, y }, Object.values(this.settings.items))) {
      this.previewItem = { ...this.previewItem, x, y };
    }
  }
  private moveEndMouse(event: PointerEvent) {
    if (event.button !== 0 || !this.active) return;
    this.endInteraction(event);
  }
  private moveEndTouch(event: Touch) {
    if (!this.active) return
    this.endInteraction(event)
  }
  scroll() {
    // TODO: scroll
  }

  resizeMouseStart(event: PointerEvent) {
    if (event.button !== 0) return
    this.initInteraction(event);
    this.initialSize = { width: this.width, height: this.height }
    this.cleanupResizeMouse = on(window, 'pointermove', (e) => this.resizeMouse(e))
    this.cleanupResizeMouseEnd = on(window, 'pointerup', (e) => this.resizeMouseEnd(e))
  }
  private resizeMouse(event: PointerEvent) {
    if (!this.settings.itemSize) {
      throw new Error('Grid is not mounted yet');
    }
    this.width = event.pageX + this.initialSize.width - this.initialPointerPosition.left;
    this.height = event.pageY + this.initialSize.height - this.initialPointerPosition.top;
    if (this.settings.bounds && this.settings.boundsTo) {
      const parentRect = this.settings.boundsTo.getBoundingClientRect();
      if (this.width + this.left > parentRect.width) {
        this.width = parentRect.width - this.left;
      }
      if (this.height + this.top > parentRect.height) {
        this.width = parentRect.height - this.top;
      }
    }
    if (this.minSize.width > this.width) {
      this.width = this.minSize.width
    } else if (this.maxSize.width < this.width) {
      this.width = this.maxSize.width
    }

    if (this.minSize.height > this.height) {
      this.height = this.minSize.height
    } else if (this.maxSize.height < this.height) {
      this.height = this.maxSize.height
    }

    const { widthGridUnits, heightGridUnits } = snapOnResize(this.width, this.height, this.previewItem, this.settings);
    if (!hasCollisions({ ...this.previewItem, widthGridUnits, heightGridUnits }, Object.values(this.settings.items))) {
      this.previewItem = {
        ...this.previewItem,
        widthGridUnits,
        heightGridUnits
      }
    }
  }
  private resizeMouseEnd(event: PointerEvent) {
    if (event.button !== 0 || !this.active) return;
    this.endInteraction(event);
  }
}
