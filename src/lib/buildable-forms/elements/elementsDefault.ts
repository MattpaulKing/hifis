import { Input, InputNumber, InputDate } from "$lib/components/forms";
import { entityFieldsSchema, entityBlocksSchema, entityBlockLayoutSchema, entityFieldLayoutSchema } from "$src/schemas";
import { GitCompareIcon, TextSearchIcon, HashIcon, CalendarDaysIcon, TextIcon, PencilIcon, Tally1Icon, MinusIcon } from "@lucide/svelte"
import { ELEMENT_TYPES } from "$routes/[orgLabel]/custom-entities/schema/entityFields";
import type { Lookup } from "$src/lib/interfaces/Lookup";
import type { FormData } from "$src/lib/interfaces/forms";
import type { Component } from "svelte";
import type { BuildableField, BuildableLayoutMetaData } from "../types";

export type FieldBtnProps = {
  render: Component,
  icon: Component,
  title: string
}

export type BuildableFieldDefault = {
  component: FieldBtnProps,
  properties: Omit<BuildableField['properties'], "id" | "entityId">,
  layout: Omit<FormData<typeof entityFieldLayoutSchema>, "id" | "fieldId"> & BuildableLayoutMetaData
}

export type BuildableBlockDefault = {
  component: FieldBtnProps,
  properties: Omit<FormData<typeof entityBlocksSchema>, "id" | "entityId">,
  layout: Omit<FormData<typeof entityBlockLayoutSchema>, "id" | "blockId"> & BuildableLayoutMetaData
}

const DEFAULT_SIZE = {
  widthGridUnits: 5,
  heightGridUnits: 3
}
const DEFAULT_LAYOUT = {
  x: Infinity,
  y: Infinity,
  ...DEFAULT_SIZE,
  view: 'xl' as const,
  min: DEFAULT_SIZE,
  moveable: true,
  resizeable: true,
  element: null,
  active: false,
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
      inputOptions: [] as Lookup[]
    },
    layout: {
      ...DEFAULT_LAYOUT
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
      inputOptions: [] as Lookup[]
    },
    layout: {
      ...DEFAULT_LAYOUT
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
      inputOptions: [] as Lookup[]
    },
    layout: {
      ...DEFAULT_LAYOUT
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
      inputOptions: [] as Lookup[]
    },
    layout: {
      ...DEFAULT_LAYOUT
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
      inputOptions: [] as Lookup[]
    },

    layout: {
      ...DEFAULT_LAYOUT
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
    },
    layout: {
      ...DEFAULT_LAYOUT
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
    },
    layout: {
      ...DEFAULT_LAYOUT
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
    },
    layout: {
      ...DEFAULT_LAYOUT
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


