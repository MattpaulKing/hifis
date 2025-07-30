import { getContext, setContext } from "svelte"
import type { BuildableBlockDefault, BuildableFieldDefault } from "./elements/elementsDefault";
import type { BuildableBlock, BuildableField, CoordsAndSize } from "./types";
import type { ELEMENT_TYPES } from "$routes/[orgLabel]/custom-entities/schema/entityFields";
import { BuildableBlockBtns } from ".";

type BuildableGridControllerArgs = {
  buildableFields: BuildableField[],
  buildableBlocks: BuildableBlock[],
  gridSize: number,
  entityId: string,
}
type BuildableGridMenuState = {
  label: string;
  showing: 'form-elements-list';
  fieldId: null;
  blockId: null;
} | {
  label: string;
  showing: 'form-field-properties';
  fieldId: string;
  blockId: null;
} | {
  label: string;
  showing: 'form-block-properties';
  blockId: string;
  fieldId: string;
}

class BuildableGridController {
  items = $state<{
    fields: BuildableField[],
    blocks: BuildableBlock[],
  }>({ fields: [], blocks: [] })
  taintedItems = $state<{
    fields: Record<string, BuildableField>,
    blocks: Record<string, BuildableBlock>
  }>({ fields: {}, blocks: {} })
  gridSize = $state<BuildableGridControllerArgs['gridSize']>(50)
  gridElement = $state<NonNullable<HTMLElement>>()
  menu = $state<BuildableGridMenuState>(DEFAULT_MENU)
  entityId: string
  dragIdx = $state<null | number>(null)
  dragItemKey = $state<(keyof typeof this.items) | null>(null)
  tempField = $state<BuildableField | null>(null)
  tempBlock = $state<BuildableBlock | null>(null)

  constructor({ buildableFields, buildableBlocks, gridSize, entityId }: BuildableGridControllerArgs) {
    this.menuDefault()
    this.items = { fields: buildableFields, blocks: buildableBlocks }
    this.gridSize = gridSize
    this.entityId = entityId
  }
  menuDefault() {
    this.menu = DEFAULT_MENU
  }
  setDragIdx({ elementType, idx }: { elementType: keyof typeof ELEMENT_TYPES, idx: number }) {
    this.dragItemKey = elementType
    this.dragIdx = idx

  }
  setMenu({ elementType, idx }: { elementType: keyof typeof ELEMENT_TYPES, idx: number }) {
    if (elementType === "fields") {
      this.menu = {
        label: this.items.fields[idx].properties.fieldType,
        showing: "form-field-properties",
        fieldId: this.items.fields[idx].properties.id,
        blockId: null
      }
    } else if (elementType === "blocks") {
      this.menu = {
        label: this.items.blocks[idx].properties.fieldType,
        showing: "form-block-properties",
        fieldId: null,
        blockId: this.items.blocks[idx].properties.id
      }
    }
  }
  clearDrag() {
    if (this.dragItemKey !== null && this.dragIdx !== null) {
      this.setMenu({ elementType: this.dragItemKey, idx: this.dragIdx })
    }
    this.dragIdx = null
    this.dragItemKey = null
    this.tempField = null
    this.tempBlock = null
  }
  onNewBlockDragStart({ e, block }: { e: DragEvent, block: BuildableBlockDefault }) {
    let id = crypto.randomUUID()
    this.tempBlock = {
      properties: { ...block.properties, id, entityId: this.entityId },
      layout: { ...block.layout, id: crypto.randomUUID(), blockId: id, x: e.offsetX, y: e.pageY }
    }
  }
  onNewFieldDragStart({ e, field }: { e: DragEvent, field: BuildableFieldDefault }) {
    let id = crypto.randomUUID()
    this.tempField = {
      properties: { ...field.properties, id, entityId: this.entityId },
      layout: { ...field.layout, id: crypto.randomUUID(), fieldId: id, x: e.offsetX, y: e.pageY }
    }
  }
  onNewBlockDragOver({ e }: { e: DragEvent }) {
    if (this.tempBlock) {
      this.items.blocks.push(this.tempBlock)
      this.dragIdx = this.items.blocks.length - 1
      this.dragItemKey = "blocks"
      this.tempBlock = null
    }
  }
  onNewFieldDragOver({ e }: { e: DragEvent }) {
    if (this.tempField) {
      this.items.fields.push(this.tempField)
      this.dragIdx = this.items.fields.length - 1
      this.dragItemKey = "fields"
      this.tempField = null
    }
  }
  onNewBlockDrag({ e }: { e: DragEvent & { currentTarget: HTMLButtonElement } }) {
    if (!this.gridElement || e.offsetX < 0 || e.pageY < 0) return //NOTE: offset sometimes < 0 ????
    let max = this.gridMax()
    let xNew = this.clamp(this.snapMovement(e.offsetX - this.gridElement.offsetLeft), 0, max.x)
    let yNew = this.clamp(this.snapMovement(e.pageY - this.gridElement.offsetTop), 0, max.y)
    if (this.tempBlock !== null) {
      this.tempBlock.layout.x = xNew
      this.tempBlock.layout.y = yNew
    } else if (this.dragIdx !== null) {
      this.items.blocks[this.dragIdx].layout.x = xNew
      this.items.blocks[this.dragIdx].layout.y = yNew
    }
  }
  onNewFieldDrag({ e }: { e: DragEvent }) {
    if (!this.gridElement || e.offsetX < 0 || e.pageY < 0) return //NOTE: offset sometimes < 0 ????
    let max = this.gridMax()
    let xNew = this.clamp(this.snapMovement(e.offsetX - this.gridElement.offsetLeft), 0, max.x)
    let yNew = this.clamp(this.snapMovement(e.pageY - this.gridElement.offsetTop), 0, max.y)
    if (this.tempField !== null) {
      this.tempField.layout.x = xNew
      this.tempField.layout.y = yNew
    } else if (this.dragIdx !== null) {
      this.items.fields[this.dragIdx].layout.x = xNew
      this.items.fields[this.dragIdx].layout.y = yNew
    }
  }
  onNewDragEnd({ e }: { e: DragEvent }) {
    this.clearDrag()
  }
  private isItemColliding<T extends CoordsAndSize>(currItem: T, item: T) {
    return (currItem.id !== item.id &&
      currItem.x <= item.x + ((item.widthGridUnits - 1) * this.gridSize) &&
      currItem.y <= item.y + ((item.heightGridUnits - 1) * this.gridSize) &&
      currItem.x + ((currItem.widthGridUnits - 1) * this.gridSize) >= item.x &&
      currItem.y + ((currItem.heightGridUnits - 1) * this.gridSize) >= item.y);

  }
  handleDelete({
    elementType,
    i
  }: {
    elementType: keyof typeof ELEMENT_TYPES;
    i: number;
  }) {
    if (!elementType) throw Error('No element type found.');
    this.items[elementType].splice(i);
  }
  hasCollisions(currItem: CoordsAndSize) {
    if (!this.dragItemKey) throw Error("Not dragging")
    return this.items[this.dragItemKey].some((item) => this.isItemColliding(currItem, item.layout));
  }
  private clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max))
  }
  private snapMovement(value: number) {
    return Math.floor(value / this.gridSize) * this.gridSize
  }
  private gridMax() {
    if (!this.gridElement) throw Error("Grid not initialized.")
    return {
      x: this.gridElement.offsetWidth - this.gridElement.offsetLeft + (this.gridSize * 2),
      y: this.gridElement.offsetHeight - this.gridElement.offsetTop - (this.gridSize * 2)
    }
  }
}

export function setBuildableGridController(args: BuildableGridControllerArgs) {
  return setContext(CTX, new BuildableGridController(args))
}
export function getBuildableGridController() {
  const res = getContext<BuildableGridController>(CTX)
  if (!res) throw Error("Grid Controller not initialized.")
  return res
}

const CTX = "BUILDABLE_GRID_CONTROLLER_CTX"
const DEFAULT_MENU = {
  label: "Form Elements",
  showing: "form-elements-list",
  fieldId: null,
  blockId: null
} as const
