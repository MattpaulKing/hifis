import { calcPosition, coordinate2size, snapOnMove, snapOnResize } from "./utils/item";
import { on } from "svelte/events";
import { getGridContext } from "./utils/GridContext.svelte";
import { getValidCoordsIfCollisionOrOutsideBounds, hasCollisions } from "./utils/grid";
import type { ItemSize, LayoutItem } from "./types";
import type { TabEntity } from "./GridItemTabsState.svelte";
import type { BuildableField, BuildableFieldPreview } from "../forms/buildable/fields";



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
  onChanged = $state<((item: BuildableField['layout']) => void) | null>(null)
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
  item: BuildableFieldPreview['layout'] = $state({
    id: "",
    x: 0,
    y: 0,
    fieldId: "",
    view: "xl",
    heightGridUnits: 0,
    widthGridUnits: 0,
    min: { widthGridUnits: 0, heightGridUnits: 0 },
    moveable: true,
    resizeable: true
  })
  previewItem = $state({ ...this.item } as LayoutItem)
  preview = $derived(calcPosition(this.previewItem, {
    itemSize: this.settings.itemSize,
    gap: this.settings.gap
  }))
  constructor({ item, min, onChanged, moveable = true, resizeable = true }: { item: BuildableField['layout'], min: BuildableFieldPreview['layout']['min'], onChanged?: (item: BuildableField['layout']) => void, moveable: boolean, resizeable: boolean }) {
    this.item = {
      ...item,
      min,
      moveable,
      resizeable,
    }
    this.previewItem = { ...this.item }
    this.onChanged = onChanged ?? null
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

      this.previewItem = { ...this.previewItem, ...getValidCoordsIfCollisionOrOutsideBounds({ item: this.item, gridSettings: this.settings }) }
    } else {
      this.previewItem = { ...this.item };
    }
    this.initialPosition = { left: this.left, top: this.top }
  }

  private applyPreview() {
    this.item.x = this.previewItem.x;
    this.item.y = this.previewItem.y;
    this.left = this.preview.left;
    this.top = this.preview.top;

    this.item.widthGridUnits = this.previewItem.widthGridUnits;
    this.item.heightGridUnits = this.previewItem.heightGridUnits;
    this.width = coordinate2size(this.previewItem.widthGridUnits, this.settings.itemSize.width, this.settings.gap)
    this.height = coordinate2size(this.previewItem.heightGridUnits, this.settings.itemSize.height, this.settings.gap)
  }


  private initInteraction(e: PointerEvent | MouseEvent | DragEvent | TouchEvent["touches"][0]) {
    this.active = true;
    this.initialPointerPosition = { left: e.pageX, top: e.pageY }
    this.initialPosition = { left: this.left, top: this.top }
    if ("pointerId" in e && this.moveableEl) {
      this.moveableEl?.setPointerCapture(e.pointerId)
    }
  }
  private endInteraction(event: PointerEvent | Touch | DragEvent) {
    this.active = false;
    this.applyPreview();
    if ("pointerId" in event) {
      this.moveableEl?.releasePointerCapture(event.pointerId)
    }
    if (this.onChanged) {
      console.log('ran')
      this.onChanged(this.item)
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
    this.cleanupMoveTouch = on(window, 'touchmove', (e) => this.move(e.touches[0]))
    this.cleanupMoveEndTouch = on(window, 'touchend', (e) => this.moveEndTouch(e.touches[0]))
  }
  moveStartMouse(event: PointerEvent | DragEvent) {
    if (event.button !== 0 || this.active) {
      return
    };
    this.initInteraction(event);
    if ("dataTransfer" in event) {
      this.cleanupMoveMouse = on(window, 'drag', (e) => this.move(e))
      this.cleanupMoveEndMouse = on(window, 'dragend', (e) => this.moveEndMouse(e))
    } else {
      this.cleanupMoveMouse = on(window, 'pointermove', (e) => this.move(e));
      this.cleanupMoveEndMouse = on(window, 'pointerup', (e) => this.moveEndMouse(e))

    }
  }
  private move(event: PointerEvent | DragEvent | Touch) {
    let _left = event.pageX - this.initialPointerPosition.left + this.initialPosition.left;
    let _top = event.pageY - this.initialPointerPosition.top + this.initialPosition.top;
    if (this.settings.bounds && this.settings.boundsTo) {
      const parentRect = this.settings.boundsTo.getBoundingClientRect();
      _left = Math.max(_left, 0)
      _left = Math.min(_left, parentRect.right - this.width)
      _top = Math.max(_top, 0)
      _top = Math.min(_top, parentRect.bottom - this.height)
    }
    this.left = _left;
    this.top = _top;
    const { x, y } = snapOnMove(this.left, this.top, this.previewItem, this.settings);
    if (!hasCollisions({ ...this.previewItem, x, y }, Object.values(this.settings.items))) {
      this.previewItem = { ...this.previewItem, x, y };
    }
  }
  private moveEndMouse(event: PointerEvent | DragEvent) {
    if (event.button !== 0 || !this.active) return;
    this.endInteraction(event);
  }
  private moveEndTouch(event: Touch) {
    if (!this.active) return
    this.endInteraction(event)
  }

  //TODO: implement scroll
  scroll() {
    // TODO: scroll
  }

  resizeMouseStart(event: MouseEvent) {
    if (event.button !== 0 || this.active) return
    this.initInteraction(event);
    this.initialSize = { width: this.width, height: this.height }
    this.cleanupResizeMouse = on(window, 'pointermove', (e) => this.resizeMouse(e))
    this.cleanupResizeMouseEnd = on(window, 'pointerup', (e) => this.resizeMouseEnd(e))
  }
  private resizeMouse(event: PointerEvent) {
    if (!this.settings.itemSize) {
      throw new Error('Grid is not mounted yet');
    }
    let _width = event.pageX + this.initialSize.width - this.initialPointerPosition.left;
    let _height = event.pageY + this.initialSize.height - this.initialPointerPosition.top;
    if (this.settings.bounds && this.settings.boundsTo) {
      const parentRect = this.settings.boundsTo.getBoundingClientRect();
      if (_width + this.left > parentRect.width + parentRect.left) {
        _width = parentRect.width - this.left;
      }
      if (_height + this.top > parentRect.height + parentRect.top) {
        _height = parentRect.height - this.top;
      }
    }
    if (_width < this.minSize.width) {
      _width = this.minSize.width
    }
    if (_width > this.maxSize.width) {
      _width = this.maxSize.width
    }
    if (_height < this.minSize.height) {
      _height = this.minSize.height
    }
    if (_height > this.maxSize.height) {
      _height = this.maxSize.height
    }
    const { widthGridUnits, heightGridUnits } = snapOnResize(_width, _height, this.previewItem, this.settings);
    if (!hasCollisions({ ...this.previewItem, widthGridUnits, heightGridUnits }, Object.values(this.settings.items))) {
      this.height = _height
      this.width = _width
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
