import { ELEMENT_TYPES, Input } from "$lib/components/forms";
import { entityFieldLayoutSchema, entityFieldsSchema } from "$src/schemas";
import { Type, TextSearch } from "@lucide/svelte"
import { position2coordinate } from "$src/lib/components/user-grid/utils/item";
import { getFirstAvailableCoords } from "../../user-grid/utils/grid";
import type { GridSettings } from "$src/lib/components/user-grid";
import type { FormValidated } from "$src/lib/interfaces";
import type { Component } from "svelte";
import type { Lookup } from "$src/lib/interfaces/Lookup";
import type { LayoutItem } from "../../user-grid/types";


const fields = {
  input: {
    category: ELEMENT_TYPES.FORM_FIELDS,
    component: {
      render: Input,
      icon: Type,
      title: 'Input'
    },
    properties: {
      id: '',
      entityId: '',
      name: 'input',
      label: 'Default Label',
      fieldType: "input" as const,
      inputType: "text",
      multiple: false,
      placeholder: "Default Placeholder",
      required: true,
      min: null,
      max: null,
      inputOptions: [] as Lookup[]
    },
    layout: {
      id: '',
      fieldId: '',
      x: Infinity,
      y: Infinity,
      widthGridUnits: 10,
      heightGridUnits: 4,
      view: 'xl',
      min: {
        widthGridUnits: 10,
        heightGridUnits: 4,
      },
      moveable: true,
      resizeable: true,
    },
  },
  lookup: {
    category: ELEMENT_TYPES.FORM_FIELDS,
    component: {
      render: Input,
      icon: TextSearch,
      title: 'Select'
    },
    properties: {
      id: '',
      entityId: '',
      name: 'lookup',
      label: 'Default Label',
      fieldType: "lookup" as const,
      inputType: null,
      multiple: false,
      placeholder: "Default Placeholder",
      required: true,
      min: null,
      max: null,
      inputOptions: [] as Lookup[]
    },
    layout: {
      id: '',
      fieldId: '',
      x: Infinity,
      y: Infinity,
      widthGridUnits: 10,
      heightGridUnits: 4,
      view: 'xl',
      min: {
        widthGridUnits: 10,
        heightGridUnits: 4,
      },
      moveable: true,
      resizeable: true,
    },
  }
} satisfies Record<string, BuildableFieldDefault>
export default fields

export type BuildableField = {
  properties: Omit<FormValidated<typeof entityFieldsSchema>['data'], 'id'> & { id: string; },
  layout: Omit<FormValidated<typeof entityFieldLayoutSchema>['data'], 'id'> & { id: string },
}
export type BuildableFieldDefault = {
  category: typeof ELEMENT_TYPES.FORM_FIELDS,
  component: {
    render: Component,
    icon: Component,
    title: string
  },
  properties: BuildableField['properties'] & { id: string; },
  layout: BuildableField['layout'] & {
    id: string;
    min: {
      widthGridUnits: number,
      heightGridUnits: number
    },
    max?: {
      widthGridUnits: number,
      heightGridUnits: number
    }
    moveable: boolean,
    resizeable: boolean
  },
}

export function buildableFieldDefault({ e, entityId, field, gridSettings }:
  { e: DragEvent, entityId: string, field: BuildableFieldDefault, gridSettings: GridSettings }): BuildableFieldDefault {

  let { itemSize, gap, boundsTo } = gridSettings
  let gridRect = boundsTo?.getBoundingClientRect()
  if (!gridRect) throw Error("Grid not initialized.")

  let fieldId = field.properties.id.length > 0 ? field.properties.id : crypto.randomUUID()
  let layoutId = field.layout.id.length > 0 ? field.layout.id : crypto.randomUUID()
  let fieldMetaData = fields[field.properties.fieldType]

  let previewEntityField = {
    ...fieldMetaData,
    properties: {
      ...field.properties,
      id: fieldId,
      entityId,
    },
    layout: {
      ...field.layout,
      id: layoutId,
      fieldId,
      x: position2coordinate(e.pageX - (gridRect.left), itemSize.width, gap),
      y: position2coordinate(e.pageY - (gridRect.top), itemSize.height, gap)
    }
  }

  return previewEntityField
}

export function buildableFieldPlacedInBounds({ item, gridSettings }: { item: BuildableFieldDefault, gridSettings: GridSettings }) {
  if (
    item.layout.x < 0 ||
    item.layout.x + item.layout.widthGridUnits >
    gridSettings.maxDimensions.cols ||
    item.layout.y < 0 ||
    item.layout.y + item.layout.heightGridUnits > gridSettings.maxDimensions.rows
  ) {
    let coords = getFirstAvailableCoords({ item: item.layout, gridSettings })
    if (!coords) throw Error("Something went wrong")
    item.layout.x = coords.x
    item.layout.y = coords.y
  }
  return item
}
