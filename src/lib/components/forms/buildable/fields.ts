import { ELEMENT_TYPES, Input } from "$lib/components/forms";
import { entityFieldPositionSchema, entityFieldSchema } from "$src/schemas";
import { Type, TextSearch } from "@lucide/svelte"
import * as v from "valibot";
import { position2coordinate } from "$src/lib/components/user-grid/utils/item";
import type { GridSettings } from "$src/lib/components/user-grid";
import type { InferInput } from "valibot";
import type { FormValidated } from "$src/lib/interfaces";
import type { Component } from "svelte";

type EntityFieldLayoutInputDefault = v.InferInput<typeof entityFieldPositionSchema> & {
  min: {
    widthGridUnits: number,
    heightGridUnits: number,
  },
  moveable: boolean,
  resizeable: boolean,
}

const fields = {
  input: {
    category: ELEMENT_TYPES.FORM_FIELDS,
    component: {
      render: Input,
      icon: Type,
      title: 'Input'
    },
    properties: {
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
      x: Infinity,
      y: Infinity,
      widthGridUnits: 4,
      heightGridUnits: 2,
      min: {
        widthGridUnits: 4,
        heightGridUnits: 2,
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
      x: Infinity,
      y: Infinity,
      widthGridUnits: 4,
      heightGridUnits: 2,
      min: {
        widthGridUnits: 4,
        heightGridUnits: 2,
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
  let { itemSize, gap } = gridSettings
  let widthGridUnits = field.layout.widthGridUnits
  let heightGridUnits = field.layout.heightGridUnits
  let fieldId = crypto.randomUUID()
  let fieldMetaData = fields[field.properties.fieldType]
  let previewEntityField = {
    ...fieldMetaData,
    properties: {
      ...field.properties,
      id: fieldId,
      entityId,
    } satisfies InferInput<typeof entityFieldSchema>,
    layout: {
      ...field.layout,
      id: field.layout.id ?? crypto.randomUUID(),
      fieldId,
      x: position2coordinate(e.clientX, itemSize.width, gap) -
        widthGridUnits,
      y: position2coordinate(e.clientY, itemSize.height, gap) -
        heightGridUnits
    }
  }
  return previewEntityField
}
