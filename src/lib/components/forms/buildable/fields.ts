import { ELEMENT_TYPES, Input } from "$lib/components/forms";
import { Type, TextSearch } from "@lucide/svelte"

const fields = {
  input: {
    id: crypto.randomUUID(),
    category: ELEMENT_TYPES.FORM_FIELDS,
    component: {
      render: Input,
      icon: Type,
      title: 'Input'
    },
    properties: {
      name: 'input',
      label: 'Default Label',
      entityId: "",
      fieldType: "input",
      inputType: "text",
      multiple: false,
      placeholder: "Default Placeholder",
      required: true,
      min: null,
      max: null
    },
    layout: {
      id: "",
      x: null,
      y: null,
      widthGridUnits: 5,
      heightGridUnits: 2,
      min: {
        widthGridUnits: 5,
        heightGridUnits: 2,
      },
      moveable: true,
      resizeable: true,
    }
  },
  lookup: {
    id: '1',
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
      fieldType: "lookup",
      inputType: null,
      multiple: false,
      placeholder: "Default Placeholder",
      required: true,
      min: null,
      max: null
    },
    layout: {
      id: "",
      x: null,
      y: null,
      widthGridUnits: 5,
      heightGridUnits: 2,
      min: {
        widthGridUnits: 5,
        heightGridUnits: 2,
      },
      moveable: true,
      resizeable: true,
    }
  }
}
export default fields
export type BuildableField = typeof fields[keyof typeof fields]
