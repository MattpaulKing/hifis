import { getContext, setContext } from "svelte"
import { on } from "svelte/events";
import { entityBlocks, layoutViewsEnum, type entitySchema } from "$src/schemas";
import { entityBlockDelete, entityBlockLayoutMetaDataQuery, entityBlockLayoutMetaDataRowsToMap, entityBlockLayoutUpsert, entityBlockUpsert, entityFieldDelete, entityFieldLayoutMetaDataQuery, entityFieldLayoutMetaDataRowsToMap, entityFieldLayoutUpsert, entityFieldUpsert } from "$routes/[orgLabel]/custom-entities/lib";
import type { BuildableBlockDefault, BuildableFieldDefault } from "./elements/elementsDefault";
import type { BuildableLayoutMetaData, CoordsAndSize } from "./types";
import type { ELEMENT_TYPES } from "$routes/[orgLabel]/custom-entities/schema/entityFields";
import type { FormData } from "../interfaces/forms";

type FieldItem = FormData<typeof entitySchema>['fields'][0]
type BlockItem = FormData<typeof entitySchema>['blocks'][0]

type BuildableField = Omit<FieldItem, "layouts"> & {
  layouts: {
    [P in keyof FieldItem['layouts']]: FieldItem['layouts'][keyof FieldItem['layouts']] & BuildableLayoutMetaData
  }
}
type BuildableBlock = FormData<typeof entitySchema>['blocks'][0] & {
  layouts: {
    [P in keyof BlockItem['layouts']]: BlockItem['layouts'][keyof BlockItem['layouts']] & BuildableLayoutMetaData
  }
}

type BuildableGridControllerArgs = {
  fields: FieldItem[];
  blocks: BlockItem[];
  fieldLayoutMetaData: Awaited<ReturnType<typeof entityFieldLayoutMetaDataQuery>>
  blockLayoutMetaData: Awaited<ReturnType<typeof entityBlockLayoutMetaDataQuery>>
  gridSize: number,
  view: typeof layoutViewsEnum.enumValues[number],
  moveable?: boolean,
  resizeable?: boolean,
  entityId: string,
}
type BuildableGridMenuState = {
  label: string;
  showing: 'form-entity-properties';
  blockId: null;
  fieldId: null;
} | {
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
  fieldId: null;
  blockId: string;
}

class BuildableGridController {

  entityId: string
  menu = $state<BuildableGridMenuState>(DEFAULT_MENU)
  view = $state<typeof layoutViewsEnum.enumValues[0]>(layoutViewsEnum.enumValues[layoutViewsEnum.length - 1])

  items = $state<{
    fields: BuildableField[],
    blocks: BuildableBlock[],
  }>({ fields: [], blocks: [] })
  taintedItems = $state<{
    fields: Record<string, BuildableField>
    blocks: Record<string, BuildableBlock>
  }>({ fields: {}, blocks: {} })

  dragIdx = $state<null | number>(null)
  dragItemKey = $state<(keyof typeof this.items) | null>(null)
  tempField = $state<BuildableField | null>(null)
  tempBlock = $state<BuildableBlock | null>(null)

  gridSize = $state<BuildableGridControllerArgs['gridSize']>(50)
  gridElement = $state<NonNullable<HTMLElement>>()

  initialSize = $state({ width: 0, height: 0 })
  initialPointerPosition = $state({ left: 0, top: 0 })
  cleanupResizeMouse = $state<void | (() => void)>()
  cleanupResizeMouseEnd = $state<void | (() => void)>()

  constructor({ fields, blocks, fieldLayoutMetaData, blockLayoutMetaData, gridSize, moveable = true, resizeable = true, view, entityId }: BuildableGridControllerArgs) {
    this.menuDefault()
    this.items = {
      fields: this.fieldsWithMetaData({ fields, fieldLayoutMetaData, moveable, resizeable }),
      blocks: this.blocksWithMetaData({ blocks, blockLayoutMetaData, moveable, resizeable })
    }
    this.gridSize = gridSize
    this.entityId = entityId
    this.view = view
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
      console.log(this.items.fields[idx])
      this.menu = {
        label: `${this.items.fields[idx].fieldType} Properties`,
        showing: "form-field-properties",
        fieldId: this.items.fields[idx].id,
        blockId: null
      }
    } else if (elementType === "blocks") {
      this.menu = {
        label: `${this.items.blocks[idx].fieldType} Properties`,
        showing: "form-block-properties",
        fieldId: null,
        blockId: this.items.blocks[idx].id
      }
    }
  }
  async clearDrag() {
    if (this.dragItemKey !== null && this.dragIdx !== null) {
      this.setMenu({ elementType: this.dragItemKey, idx: this.dragIdx })
    }
    this.dragIdx = null
    this.dragItemKey = null
    this.tempField = null
    this.tempBlock = null
  }
  private fieldsWithMetaData({ fieldLayoutMetaData, fields, moveable, resizeable }: { fields: BuildableGridControllerArgs['fields'], fieldLayoutMetaData: BuildableGridControllerArgs['fieldLayoutMetaData'], moveable: boolean, resizeable: boolean }) {
    let fieldLayoutMap = entityFieldLayoutMetaDataRowsToMap({ rows: fieldLayoutMetaData, resizeable, moveable })
    return fields.map((field) => {
      let layouts = {} as BuildableField['layouts']
      for (const keyUntyped in field.layouts) {
        let key = keyUntyped as keyof BuildableField['layouts']
        if (!field.elementType) throw Error("No Element Type")
        layouts[key] = {
          ...field.layouts[key],
          ...fieldLayoutMap[field.fieldType],
        }
      }
      return { ...field, layouts }
    })
  }
  private blocksWithMetaData({ blockLayoutMetaData, blocks, moveable, resizeable }: { blocks: BuildableGridControllerArgs['blocks'], blockLayoutMetaData: BuildableGridControllerArgs['blockLayoutMetaData'], moveable: boolean, resizeable: boolean }) {
    let blockLayoutMap = entityBlockLayoutMetaDataRowsToMap({ rows: blockLayoutMetaData, resizeable, moveable })
    return blocks.map((block) => {
      let layouts = {} as BuildableBlock['layouts']
      for (const keyUntyped in block.layouts) {
        let key = keyUntyped as keyof BuildableField['layouts']
        if (!block.elementType) throw Error("No Element Type")
        layouts[key] = {
          ...block.layouts[key],
          ...blockLayoutMap[block.fieldType],
        }
      }
      return { ...block, layouts }
    })
  }
  private blockDefaultToLayoutsWithIds({ id, block }: { id: string, block: BuildableBlockDefault }) {
    let layouts = {} as BuildableBlock['layouts']
    for (let key in block.properties.layouts) {
      let keyTyped = key as typeof layoutViewsEnum.enumValues[0]
      layouts[keyTyped] = {
        ...block.properties.layouts[keyTyped],
        blockId: id,
        id: crypto.randomUUID()
      }
    }
    return layouts
  }
  private fieldDefaultToLayoutsWithIds({ id, field }: { id: string, field: BuildableFieldDefault }) {
    let layouts = {} as BuildableField['layouts']
    for (let key in field.properties.layouts) {
      let keyTyped = key as typeof layoutViewsEnum.enumValues[0]
      layouts[keyTyped] = {
        ...field.properties.layouts[keyTyped],
        fieldId: id,
        id: crypto.randomUUID()
      }
    }
    return layouts
  }
  onNewBlockDragStart({ e, block }: { e: DragEvent, block: BuildableBlockDefault }) {
    let id = crypto.randomUUID()
    this.tempBlock = {
      ...block.properties,
      layouts: this.blockDefaultToLayoutsWithIds({ id, block }),
      id,
      entityId: this.entityId,
    }
  }
  onNewFieldDragStart({ e, field }: { e: DragEvent, field: BuildableFieldDefault }) {
    let id = crypto.randomUUID()
    this.tempField = {
      ...field.properties,
      layouts: this.fieldDefaultToLayoutsWithIds({ id, field }),
      id,
      entityId: this.entityId
    }
  }
  async onNewBlockDragOver({ e }: { e: DragEvent }) {
    if (this.tempBlock) {
      let block = this.tempBlock
      this.items.blocks.push(block)
      this.dragIdx = this.items.blocks.length - 1
      this.dragItemKey = "blocks"
      this.tempBlock = null
      // await entityBlockUpsert(block)
    }
  }
  async onNewFieldDragOver({ e }: { e: DragEvent }) {
    if (this.tempField) {
      let field = this.tempField
      this.items.fields.push(field)
      this.dragIdx = this.items.fields.length - 1
      this.dragItemKey = "fields"
      this.tempField = null
      // await entityFieldUpsert(field)
    }
  }
  async onDragEnter({ e }: { e: DragEvent }) {
    if (this.tempField) {
      await this.onNewFieldDragOver({ e })
    } else if (this.tempBlock) {
      await this.onNewBlockDragOver({ e })
    } else {
      throw Error("No element dragged")
    }
  }
  onNewBlockDrag({ e }: { e: DragEvent & { currentTarget: HTMLButtonElement } }) {
    if (!this.gridElement || e.offsetX < 0 || e.pageY < 0) return //NOTE: offset sometimes < 0 ????
    let max = this.gridMax()
    let xNew = this.clamp(this.snapMovement(e.offsetX - this.gridElement.offsetLeft), 0, max.x)
    let yNew = this.clamp(this.snapMovement(e.pageY - this.gridElement.offsetTop), 0, max.y)
    if (this.tempBlock !== null) {
      this.tempBlock.layouts[this.view].x = xNew
      this.tempBlock.layouts[this.view].y = yNew
    } else if (this.dragIdx !== null) {
      this.items.blocks[this.dragIdx].layouts[this.view].x = xNew
      this.items.blocks[this.dragIdx].layouts[this.view].y = yNew
    }
  }
  onNewFieldDrag({ e }: { e: DragEvent }) {
    if (!this.gridElement || e.offsetX < 0 || e.pageY < 0) return //NOTE: offset sometimes < 0 ????
    let max = this.gridMax()
    let xNew = this.clamp(this.snapMovement(e.offsetX - this.gridElement.offsetLeft), 0, max.x)
    let yNew = this.clamp(this.snapMovement(e.pageY - this.gridElement.offsetTop), 0, max.y)
    if (this.tempField !== null) {
      this.tempField.layouts[this.view].x = xNew
      this.tempField.layouts[this.view].y = yNew
    } else if (this.dragIdx !== null) {
      this.items.fields[this.dragIdx].layouts[this.view].x = xNew
      this.items.fields[this.dragIdx].layouts[this.view].y = yNew
    }
  }
  async onNewDragEnd({ e }: { e: DragEvent }) {
    if (this.dragItemKey === "fields" && this.dragIdx !== null) {
      console.log(this.items[this.dragItemKey][this.dragIdx])
      await entityFieldUpsert(this.items[this.dragItemKey][this.dragIdx])
    } else if (this.dragItemKey === "blocks" && this.dragIdx !== null) {
      await entityBlockUpsert(this.items[this.dragItemKey][this.dragIdx])
    }
    this.clearDrag()
  }
  private isItemColliding<T extends CoordsAndSize>(currItem: T, item: T) {
    return (currItem.id !== item.id &&
      currItem.x <= (item.x + (item.widthGridUnits * this.gridSize)) &&
      currItem.y <= (item.y + (item.heightGridUnits * this.gridSize)) &&
      (currItem.x + (currItem.widthGridUnits * this.gridSize)) >= item.x &&
      (currItem.y + (currItem.heightGridUnits * this.gridSize)) >= item.y)
  }

  async handleDelete({
    elementType,
    i
  }: {
    elementType: keyof typeof ELEMENT_TYPES;
    i: number;
  }) {
    if (!elementType) throw Error('No element type found.');
    let id = this.items[elementType][i].id
    if (elementType === "fields") {
      await entityFieldDelete(this.items[elementType][i].id)
      this.items.fields = this.items.fields.filter((field) => field.id !== id)
    } else if (elementType === "blocks") {
      await entityBlockDelete(this.items[elementType][i].id)
      this.items.blocks = this.items.blocks.filter((block) => block.id !== id)
    }
    if (this.menu.fieldId === id || this.menu.blockId === id) this.menuDefault()
  }
  hasCollisions(item: CoordsAndSize) {
    let isColliding = this.items.fields.some((field) => this.isItemColliding(item, field.layouts[this.view])) || this.items.blocks.some((block) => this.isItemColliding(item, block.layouts[this.view]))
    return isColliding
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
  private initInteraction({ e, elementType, idx }: { e: PointerEvent | MouseEvent | DragEvent | TouchEvent["touches"][0], elementType: keyof typeof ELEMENT_TYPES, idx: number }) {
    this.items[elementType][idx].layouts[this.view].active = true;
    this.initialPointerPosition = { left: e.pageX, top: e.pageY }
    this.initialSize = {
      width: this.items[elementType][idx].layouts[this.view].widthGridUnits * this.gridSize,
      height: this.items[elementType][idx].layouts[this.view].heightGridUnits * this.gridSize
    }
    if ("pointerId" in e && this.items[elementType][idx].layouts[this.view].element) {
      this.items[elementType][idx].layouts[this.view].element?.setPointerCapture(e.pointerId)
    }
  }
  resizeMouseStart({ e, elementType, idx }: { e: MouseEvent, elementType: keyof typeof ELEMENT_TYPES, idx: number }) {
    if (e.button !== 0 || this.items[elementType][idx].layouts[this.view].active) return
    this.initInteraction({ e, elementType, idx });
    this.cleanupResizeMouse = on(window, 'pointermove', (e) => this.resizeMouse({ e, elementType, idx }))
    this.cleanupResizeMouseEnd = on(window, 'pointerup', (e) => this.resizeMouseEnd({ e, elementType, idx }))
  }
  private resizeMouse({ e, elementType, idx }: { e: MouseEvent, elementType: keyof typeof ELEMENT_TYPES, idx: number }) {
    let _width = e.pageX + this.initialSize.width - this.initialPointerPosition.left;
    let _height = e.pageY + this.initialSize.height - this.initialPointerPosition.top;
    let minSize = {
      width: this.items[elementType][idx].layouts[this.view].min.widthGridUnits * this.gridSize,
      height: this.items[elementType][idx].layouts[this.view].min.heightGridUnits * this.gridSize
    }
    if (this.gridElement) {
      const parentRect = this.gridElement.getBoundingClientRect();
      if (_width > parentRect.width) {
        _width = parentRect.width;
      }
      if (_height > parentRect.height) {
        _height = parentRect.height;
      }
    }
    _width = Math.max(_width, minSize.width)
    _height = Math.max(_height, minSize.height)
    this.items[elementType][idx].layouts[this.view] = {
      ...this.items[elementType][idx].layouts[this.view],
      widthGridUnits: Math.round(_width / this.gridSize),
      heightGridUnits: Math.round(_height / this.gridSize)
    }
  }
  private async resizeMouseEnd({ e, elementType, idx }: { e: PointerEvent, elementType: keyof typeof ELEMENT_TYPES, idx: number }) {
    if (e.button !== 0 || !this.items[elementType][idx].layouts[this.view].active) return;
    this.items[elementType][idx].layouts[this.view].active = false;
    if (elementType === "fields") {
      await entityFieldLayoutUpsert(this.items[elementType][idx].layouts[this.view])
    } else if (elementType === "blocks") {
      await entityBlockLayoutUpsert(this.items[elementType][idx].layouts[this.view])
    }
    if ("pointerId" in e) {
      this.items[elementType][idx].layouts[this.view].element?.releasePointerCapture(e.pointerId)
    }
    if (this.cleanupResizeMouse) this.cleanupResizeMouse()
    if (this.cleanupResizeMouseEnd) this.cleanupResizeMouseEnd()
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
} satisfies BuildableGridMenuState
