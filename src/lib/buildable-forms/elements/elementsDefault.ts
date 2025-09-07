import { Input, InputNumber, InputDate } from "$lib/components/forms";
import { entityFieldsSchema, entityBlocksSchema, entitySchema } from "$src/schemas";
import { GitCompareIcon, TextSearchIcon, HashIcon, CalendarDaysIcon, TextIcon, PencilIcon, Tally1Icon, MinusIcon } from "@lucide/svelte"
import { ELEMENT_TYPES } from "$routes/[orgLabel]/custom-entities/schema/entityFields";
import type { Lookup } from "$src/lib/interfaces/Lookup";
import type { FormData } from "$src/lib/interfaces/forms";
import type { Component } from "svelte";
import type { BuildableLayoutMetaData } from "../types";

export type FieldBtnProps = {
  render: Component,
  icon: Component,
  title: string
}

export type BuildableFieldDefault = {
  component: FieldBtnProps,
  properties: Omit<FormData<typeof entitySchema>['fields'][0], "id" | "entityId" | "layouts"> & {
    layouts: {
      [P in keyof FormData<typeof entitySchema>['fields'][0]['layouts']]: Omit<FormData<typeof entitySchema>['fields'][0]['layouts']['xl'], "id" | "fieldId"> & BuildableLayoutMetaData
    }
  },
}

export type BuildableBlockDefault = {
  component: FieldBtnProps,
  properties: Omit<FormData<typeof entitySchema>['blocks'][0], "id" | "entityId" | "layouts"> & {
    layouts: {
      [P in keyof FormData<typeof entitySchema>['blocks'][0]['layouts']]: Omit<FormData<typeof entitySchema>['blocks'][0]['layouts']['xl'], "id" | "blockId"> & BuildableLayoutMetaData
    }
  }
}

const SIZE_MIN = {
  widthGridUnits: 5,
  heightGridUnits: 3
}
const DEFAULT_LAYOUT = {
  x: 0,
  y: 0,
  ...SIZE_MIN,
  view: 'xl' as const,
  min: SIZE_MIN,
  moveable: true,
  resizeable: true,
  element: null,
  active: false,
}
const DEFAULT_LAYOUTS = {
  sm: { ...DEFAULT_LAYOUT, view: "sm" as const },
  lg: { ...DEFAULT_LAYOUT, view: "lg" as const },
  xl: { ...DEFAULT_LAYOUT, view: "xl" as const },
}

const fields = {
  input: {
    component: {
      render: Input,
      icon: PencilIcon,
      title: 'Text'
    },
    properties: {
      name: 'input',
      label: 'Default Label',
      elementType: ELEMENT_TYPES.fields,
      fieldType: "input" as const,
      inputType: "text",
      multiple: false,
      placeholder: "Default Placeholder",
      required: true,
      min: null,
      max: null,
      inputOptions: [] as Lookup[],
      layouts: DEFAULT_LAYOUTS
    },
  },
  number: {
    component: {
      render: InputNumber,
      icon: HashIcon,
      title: 'Number'
    },
    properties: {
      name: 'number',
      label: 'Default Label',
      elementType: ELEMENT_TYPES.fields,
      fieldType: "input" as const,
      inputType: "number",
      multiple: false,
      placeholder: "Default Placeholder",
      required: true,
      min: null,
      max: null,
      inputOptions: [] as Lookup[],
      layouts: DEFAULT_LAYOUTS
    },
  },
  date: {
    component: {
      render: InputDate,
      icon: CalendarDaysIcon,
      title: 'Date'
    },
    properties: {
      name: 'date',
      label: 'Default Label',
      elementType: ELEMENT_TYPES.fields,
      fieldType: "date" as const,
      inputType: "date",
      multiple: false,
      placeholder: "",
      required: true,
      min: null,
      max: null,
      inputOptions: [] as Lookup[],
      layouts: DEFAULT_LAYOUTS
    },

  },
  lookup: {
    component: {
      render: Input,
      icon: GitCompareIcon,
      title: 'Lookup'
    },
    properties: {
      name: 'lookup',
      label: 'Default Label',
      elementType: ELEMENT_TYPES.fields,
      fieldType: "lookup" as const,
      inputType: null,
      multiple: false,
      placeholder: "Default Placeholder",
      required: true,
      min: null,
      max: null,
      inputOptions: [] as Lookup[],
      layouts: DEFAULT_LAYOUTS
    },
  },
  select: {
    component: {
      render: Input,
      icon: TextSearchIcon,
      title: 'Select'
    },
    properties: {
      name: 'lookup',
      label: 'Default Label',
      elementType: ELEMENT_TYPES.fields,
      fieldType: "lookup" as const,
      inputType: null,
      multiple: false,
      placeholder: "Default Placeholder",
      required: true,
      min: null,
      max: null,
      inputOptions: [] as Lookup[],
      layouts: DEFAULT_LAYOUTS
    },
  }
} satisfies Record<string, BuildableFieldDefault>

const blocks = {
  textBlock: {
    component: {
      render: InputDate,
      icon: TextIcon,
      title: 'Text'
    },
    properties: {
      elementType: "blocks",
      fieldType: "textBlock" as const,
      size: "lg",
      color: "white",
      textValue: "Default Text",
      layouts: DEFAULT_LAYOUTS
    },
  },
  dividerHorizontal: {
    component: {
      render: InputDate,
      icon: MinusIcon,
      title: 'Divider'
    },
    properties: {
      elementType: "blocks",
      fieldType: "dividerHorizontal" as const,
      size: "",
      color: "",
      textValue: "",
      layouts: DEFAULT_LAYOUTS
    },
  },
  dividerVertical: {
    component: {
      render: InputDate,
      icon: Tally1Icon,
      title: 'Divider'
    },
    properties: {
      elementType: "blocks",
      fieldType: "dividerVertical" as const,
      size: "",
      color: "",
      textValue: "",
      layouts: DEFAULT_LAYOUTS
    },
  }
} satisfies Record<string, BuildableBlockDefault>

const formElements: {
  [ELEMENT_TYPES.fields]: Record<FormData<typeof entityFieldsSchema>['fieldType'], BuildableFieldDefault>
}
  & { [ELEMENT_TYPES.blocks]: Record<FormData<typeof entityBlocksSchema>['fieldType'], BuildableBlockDefault> } = {
  [ELEMENT_TYPES.fields]: fields,
  [ELEMENT_TYPES.blocks]: blocks,
}
export default formElements
