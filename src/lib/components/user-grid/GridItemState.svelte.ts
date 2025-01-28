import { calcPosition, coordinate2size, snapOnMove } from "./utils/item";
import { on } from "svelte/events";
import { GridItem } from "svelte-grid-extended"
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
  cleanupMove = $state<null | (() => void)>(null)
  cleanupMoveEnd = $state<null | (() => void)>(null)
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
  initInteraction(event: PointerEvent) {
    this.previewItem = { ...this.item }
    this.active = true;
    this.initialPointerPosition.left = event.pageX;
    this.initialPointerPosition.top = event.pageY;
    this.moveableItemRef?.setPointerCapture(event.pointerId);
  }
  endInteraction(event: PointerEvent) {
    this.applyPreview();
    this.active = false;
    this.initialPointerPosition.left = 0;
    this.initialPointerPosition.top = 0;
    this.moveableItemRef?.releasePointerCapture(event.pointerId);
  }
  moveStart(event: PointerEvent) {
    if (event.button !== 0) return;
    this.initInteraction(event);
    this.initialPosition = { left: this.left, top: this.top };
    this.initialPointerPosition = { left: event.pageX, top: event.pageY }
    this.cleanupMove = on(window, 'pointermove', (e) => this.move(e));
    this.cleanupMoveEnd = on(window, 'pointerup', (e) => this.moveEnd(e))
  }
  move(event: PointerEvent) {
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
    console.log('ran')
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
  moveEnd(event: PointerEvent) {
    if (event.button !== 0 || !this.active) return;
    this.endInteraction(event);
    if (!this.cleanupMove || !this.cleanupMoveEnd) throw Error("No Cleanup")
    this.cleanupMove();
    clearInterval(this.throttleInterval)
    this.cleanupMoveEnd()
  }
  scroll() {
    // TODO: scroll
  }
}
