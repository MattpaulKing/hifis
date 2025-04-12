import { ELEMENT_TYPES, Input } from "$lib/components/forms";
import { entityFieldPositionSchema, entityFieldSchema } from "$src/schemas";
import { Type, TextSearch } from "@lucide/svelte"
import { position2coordinate } from "$src/lib/components/user-grid/utils/item";
import type { GridSettings } from "$src/lib/components/user-grid";
import type { FormValidated } from "$src/lib/interfaces";
import type { Component } from "svelte";


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
      max: null
    },
    layout: {
      id: '',
      fieldId: '',
      x: Infinity,
      y: Infinity,
      widthGridUnits: 10,
      heightGridUnits: 4,
      min: {
        widthGridUnits: 10,
        heightGridUnits: 4,
      },
      moveable: true,
      resizeable: true,
    }
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
      max: null
    },
    layout: {
      id: '',
      fieldId: '',
      x: Infinity,
      y: Infinity,
      widthGridUnits: 10,
      heightGridUnits: 4,
      min: {
        widthGridUnits: 10,
        heightGridUnits: 4,
      },
      moveable: true,
      resizeable: true,
    }
  }
} satisfies Record<string, BuildableFieldPreview>
export default fields

export type BuildableField = {
  properties: Omit<FormValidated<typeof entityFieldSchema>['data'], 'id'> & { id: string; },
  layout: Omit<FormValidated<typeof entityFieldPositionSchema>['data'], 'id'> & { id: string }
}
export type BuildableFieldPreview = {
  category: typeof ELEMENT_TYPES.FORM_FIELDS,
  component: {
    render: Component,
    icon: Component,
    title: string
  },
  properties: Omit<FormValidated<typeof entityFieldSchema>['data'], 'id'> & { id: string; },
  layout: Omit<FormValidated<typeof entityFieldPositionSchema>['data'], 'id'> & {
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
  }
}

export function buildableFieldDefault({ e, entityId, field, gridSettings }:
  { e: DragEvent, entityId: string, field: BuildableFieldPreview, gridSettings: GridSettings }): BuildableFieldPreview {
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
      x: Math.max(position2coordinate(e.pageX - (gridRect.left), itemSize.width, gap), 0),
      y: Math.max(position2coordinate(e.pageY - (gridRect.top), itemSize.height, gap), 0)
    }
  }
  return previewEntityField
}
