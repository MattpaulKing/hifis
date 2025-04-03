import { ELEMENT_TYPES, Input } from "$lib/components/forms";
import { entityFieldPositionSchema, type entityFieldSchema } from "$src/schemas";
import { Type, TextSearch } from "@lucide/svelte"
import * as v from "valibot";
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
    type: "input",
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
    } satisfies Omit<v.InferInput<typeof entityFieldSchema>, "entityId">,
    layout: {
      id: "",
      fieldId: "", //TODO: have to actually make this real when pulling from DB
      x: Infinity,
      y: Infinity,
      widthGridUnits: 5,
      heightGridUnits: 2,
      min: {
        widthGridUnits: 5,
        heightGridUnits: 2,
      },
      moveable: true,
      resizeable: true,
    } satisfies EntityFieldLayoutInputDefault
  },
  lookup: {
    category: ELEMENT_TYPES.FORM_FIELDS,
    type: 'select',
    component: {
      render: Input,
      icon: TextSearch,
      title: 'Select'
    },
    properties: {
      name: 'lookup',
      label: 'Default Label',
      entityId: "",
      fieldType: "lookup" as const,
      inputType: null,
      multiple: false,
      placeholder: "Default Placeholder",
      required: true,
      min: null,
      max: null
    },
    layout: {
      id: "",
      fieldId: "",
      x: Infinity,
      y: Infinity,
      widthGridUnits: 5,
      heightGridUnits: 2,
      min: {
        widthGridUnits: 5,
        heightGridUnits: 2,
      },
      moveable: true,
      resizeable: true,
    } satisfies EntityFieldLayoutInputDefault
  }
}
export default fields
export type BuildableField = {
  category: typeof ELEMENT_TYPES.FORM_FIELDS,
  type: keyof typeof fields & string,
  component: {
    render: Component,
    icon: Component,
    title: string
  },
  properties: Omit<v.InferInput<typeof entityFieldSchema>, "entityId">,
  layout: Omit<EntityFieldLayoutInputDefault, "id"> & { id: string }
}
