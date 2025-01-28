import { calcPosition, coordinate2size, snapOnMove } from "./utils/item";
import { on } from "svelte/events";
import { getGridContext } from "./utils/GridContext.svelte";
import { hasCollisions } from "./utils/grid";
import type { ItemSize, LayoutItem, LayoutItemEntity } from "./types";

export default class {
  active = $state(false);
  throttleInterval = $state<ReturnType<typeof setInterval>>()
  left = $state(0);
  top = $state(0);
  width = $state(0);
  height = $state(0);
  initialPointerPosition = $state({ left: 0, top: 0 });
  initialPosition = $state({ left: 0, top: 0 })
  moveableItemRef = $state<HTMLElement>()
  entities = $state<LayoutItemEntity[]>([])
  activeEntity = $derived(this.entities.find((entity) => entity.active));
  cleanupMoveMouse = $state<null | (() => void)>(null)
  cleanupMoveEndMouse = $state<null | (() => void)>(null)
  cleanupMoveTouch = $state<null | (() => void)>(null)
  cleanupMoveEndTouch = $state<null | (() => void)>(null)
  itemSize = $state<ItemSize>({ height: 64, width: 64 })
  gap = $state(64)
  bounds = $state(false)
  boundsTo = $state<HTMLElement>()
  settings = getGridContext()
  minSize: ItemSize = $derived.by(() => {
    return {
      width: coordinate2size(this.item.min.w, this.settings.itemSize.width, this.settings.gap),
      height: coordinate2size(this.item.min.h, this.settings.itemSize.height, this.settings.gap)
    };
  });
  maxSize: ItemSize = $derived.by(() => {
    return {
      width: coordinate2size(
        this.item.max?.w ?? Infinity,
        this.settings.itemSize.width,
        this.settings.gap
      ),
      height: coordinate2size(
        this.item.max?.h ?? Infinity,
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
      const newPosition = calcPosition(this.item, {
        itemSize: this.settings.itemSize,
        gap: this.settings.gap
      });
      this.left = newPosition.left;
      this.top = newPosition.top;
      this.width = newPosition.width;
      this.height = newPosition.height;
      this.initialPosition = { left: this.left, top: this.top }
    }

    if (!this.active && this.item) {
      this.previewItem = this.item;
    }
  }

  applyPreview() {
    this.item.x = this.previewItem.x;
    this.item.y = this.previewItem.y;
    this.item.w = this.previewItem.w;
    this.item.h = this.previewItem.h;
    this.left = this.preview.left;
    this.top = this.preview.top;
    this.width = this.preview.width;
    this.height = this.preview.height;
  }
  initInteraction({ pageX, pageY }: PointerEvent | TouchEvent["touches"][0]) {
    this.previewItem = { ...this.item }
    this.active = true;
    this.initialPointerPosition.left = pageX;
    this.initialPointerPosition.top = pageY;
    this.initialPosition = { left: this.left, top: this.top };
    this.initialPointerPosition = { left: pageX, top: pageY }
  }
  endInteraction() {
    this.applyPreview();
    this.active = false;
    this.initialPointerPosition.left = 0;
    this.initialPointerPosition.top = 0;
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
}
