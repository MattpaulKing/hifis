import { calcPosition, coordinate2position, coordinate2size, snapOnMove, snapOnResize } from "./utils/item";
import { on } from "svelte/events";
import { getGridContext } from "./utils/GridContext.svelte";
import { getAvailablePosition, hasCollisions } from "./utils/grid";
import { GridItem } from "svelte-grid-extended"
import type { ItemSize, LayoutItem, LayoutItemEntity } from "./types";


//TODO: 

export default class {
  active = $state(false);
  throttleInterval = $state<ReturnType<typeof setInterval>>()
  left = $state(0);
  top = $state(0);
  width = $state(0);
  height = $state(0);
  initialPointerPosition = $state({ left: 0, top: 0 });
  initialPosition = $state({ left: 0, top: 0 })
  initialSize = $state({ width: 0, height: 0 })
  moveableItemRef = $state<HTMLElement>()
  entities = $state<LayoutItemEntity[]>([])
  activeEntity = $derived(this.entities.find((entity) => entity.active));
  cleanupMoveMouse = $state<null | (() => void)>(null)
  cleanupMoveEndMouse = $state<null | (() => void)>(null)
  cleanupMoveTouch = $state<null | (() => void)>(null)
  cleanupMoveEndTouch = $state<null | (() => void)>(null)
  cleanupResizeMouse = $state<null | (() => void)>(null)
  cleanupResizeMouseEnd = $state<null | (() => void)>(null)
  settings = getGridContext()
  minSize: ItemSize = $derived.by(() => {
    return {
      width: coordinate2size(this.item.min.width, this.settings.itemSize.width, this.settings.gap),
      height: coordinate2size(this.item.min.height, this.settings.itemSize.height, this.settings.gap)
    };
  });
  maxSize: ItemSize = $derived.by(() => {
    return {
      width: coordinate2size(
        this.item.max?.width ?? Infinity,
        this.settings.itemSize.width,
        this.settings.gap
      ),
      height: coordinate2size(
        this.item.max?.height ?? Infinity,
        this.settings.itemSize.height,
        this.settings.gap
      )
    }
  })
  item = $state({} as LayoutItem)
  previewItem = $state({} as LayoutItem)
  preview = $derived(
    calcPosition(this.previewItem, {
      itemSize: this.settings.itemSize,
      gap: this.settings.gap
    })
  );
  constructor({ item, entities }:
    { item: LayoutItem, entities: LayoutItemEntity[] }) {
    this.item = item
    this.previewItem = { ...item }
    this.entities = entities
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
        let newCoords = this.getFirstAvailableCoords(this)
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
  private getFirstAvailableCoords({ width, height }: { width: number, height: number }): {
    x: number;
    y: number;
  } | null {
    let rect = this.settings.boundsTo?.getBoundingClientRect()
    if (!rect) return null
    let maxCols = Math.round(rect.width / (this.settings.itemSize.width + this.settings.gap)) - 1
    let maxRows = Math.round(rect.height / (this.settings.itemSize.height + this.settings.gap)) - 1
    return getAvailablePosition({
      id: '',
      x: 0,
      y: 0,
      width,
      height,
      min: { width: 32, height: 32 },
      moveable: true,
      resizeable: true,
    }, Object.values(this.settings.items), maxCols, maxRows);
  }

  applyPreview() {
    this.item.x = this.previewItem.x;
    this.item.y = this.previewItem.y;
    this.item.width = this.previewItem.width;
    this.item.height = this.previewItem.height;
    this.left = this.preview.left;
    this.top = this.preview.top;
    this.width = this.preview.width;
    this.height = this.preview.height;
  }
  initInteraction({ pageX, pageY }: PointerEvent | TouchEvent["touches"][0]) {
    this.previewItem = { ...this.item }
    this.active = true;
    this.initialPosition = { left: this.left, top: this.top };
    this.initialPointerPosition = { left: pageX, top: pageY }
    this.initialSize = { height: this.height, width: this.width }
  }
  endInteraction() {
    this.applyPreview();
    this.active = false;
    // this.initialPointerPosition.left = 0;
    // this.initialPointerPosition.top = 0;
  }
  moveStartTouch(e: TouchEvent) {
    this.initInteraction(e.touches[0])
    this.cleanupMoveTouch = on(window, 'touchmove', (e) => this.move(e.touches[0]))
    this.cleanupMoveEndTouch = on(window, 'touchend', () => this.moveEndTouch())
  }
  moveStartMouse(event: PointerEvent) {
    if (event.button !== 0) return;
    this.initInteraction(event);
    this.moveableItemRef?.setPointerCapture(event.pointerId);
    this.cleanupMoveMouse = on(window, 'pointermove', (e) => this.move(e));
    this.cleanupMoveEndMouse = on(window, 'pointerup', (e) => this.moveEndMouse(e))
  }
  move(event: PointerEvent | Touch) {
    if (!this.settings.itemSize) {
      throw new Error('Grid is not mounted yet');
    }
    let _left = event.pageX - this.initialPointerPosition.left + this.initialPosition.left;
    let _top = event.pageY - this.initialPointerPosition.top + this.initialPosition.top;
    if (this.settings.bounds && this.settings.boundsTo) {
      const parentRect = this.settings.boundsTo.getBoundingClientRect();
      if (_left < parentRect.left) {
        _left = parentRect.left;
      }
      if (_top < parentRect.top) {
        _top = parentRect.top;
      }
      if (_left + this.width > parentRect.right) {
        _left = parentRect.right - this.width;
      }
      if (_top + this.height > parentRect.bottom) {
        _top = parentRect.bottom - this.height;
      }
    }
    this.left = _left;
    this.top = _top;
    //TODO: implement scroll
    // scroll();
    this.throttleInterval = setInterval(() => {
      const { x, y } = snapOnMove(this.left, this.top, this.previewItem, this.settings);
      if (!hasCollisions({ ...this.previewItem, x, y }, Object.values(this.settings.items))) {
        this.previewItem = { ...this.previewItem, x, y };
      }
    }, 100)
  }
  moveEndMouse(event: PointerEvent) {
    if (event.button !== 0 || !this.active) return;
    this.endInteraction();
    this.moveableItemRef?.releasePointerCapture(event.pointerId);
    if (!this.cleanupMoveMouse || !this.cleanupMoveEndMouse) throw Error("No Cleanup")
    this.cleanupMoveMouse();
    clearInterval(this.throttleInterval)
    this.cleanupMoveEndMouse()
  }
  moveEndTouch() {
    if (!this.active) return
    this.endInteraction()
    if (!this.cleanupMoveTouch || !this.cleanupMoveEndTouch) throw Error("No Cleanup")
    this.cleanupMoveTouch();
    clearInterval(this.throttleInterval)
    this.cleanupMoveEndTouch()
  }
  scroll() {
    // TODO: scroll
  }

  resizeMouseStart(event: PointerEvent) {
    if (event.button !== 0) return;
    this.initInteraction(event);
    this.moveableItemRef?.setPointerCapture(event.pointerId)
    this.cleanupResizeMouse = on(window, 'pointermove', (e) => this.resizeMouse(e))
    this.cleanupResizeMouseEnd = on(window, 'pointerup', (e) => this.resizeMouseEnd(e))

  }
  resizeMouse(event: PointerEvent | Touch) {
    if (!this.settings.itemSize) {
      throw new Error('Grid is not mounted yet');
    }
    let _width = event.pageX + this.initialSize.width - this.initialPointerPosition.left;
    let _height = event.pageY + this.initialSize.height - this.initialPointerPosition.top;
    if (this.settings.bounds && this.settings.boundsTo) {
      const parentRect = this.settings.boundsTo.getBoundingClientRect();
      if (this.width + this.left > parentRect.width) {
        _width = parentRect.width - this.left;
      }
      if (this.height + this.top > parentRect.height) {
        _height = parentRect.height - this.top;
      }
    }
    if (this.minSize && _width < this.minSize.width) {
      _width = this.minSize.width
    } if (this.minSize && _height < this.minSize.height) {
      _height = this.minSize.height
    }
    if (this.maxSize && _width > this.maxSize.width) {
      _width = this.maxSize.width
    } if (this.maxSize && _height > this.maxSize.height) {
      _height = this.maxSize.height
    }
    // scroll();
    this.throttleInterval = setInterval(() => {
      const { width, height } = snapOnResize(_width, _height, this.previewItem, this.settings);
      if (!hasCollisions({ ...this.previewItem, width, height }, Object.values(this.settings.items))) {
        this.previewItem = { ...this.previewItem, width, height };
      }
    }, 100)
  }
  resizeMouseEnd(event: PointerEvent) {
    if (event.button !== 0) return;
    this.endInteraction();
    if (!this.cleanupResizeMouse || !this.cleanupResizeMouseEnd) throw Error("No cleanup")
    clearInterval(this.throttleInterval)
    this.cleanupResizeMouse()
    this.cleanupResizeMouseEnd()
  }
}
