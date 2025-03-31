import { ELEMENT_TYPES, Input } from "$lib/components/forms";
import { Type, TextSearch } from "@lucide/svelte"


const fields = {
  input: {
    id: crypto.randomUUID(),
    category: ELEMENT_TYPES.FORM_FIELDS,
    type: 'input',
    component: {
      render: Input,
      icon: Type,
      title: 'Input'
    },
    settings: {
      properties: {
        name: 'input-0',
        label: 'Input',
      },
      attributes: {
        placeholder: 'Enter input text'
      }
    },
    layout: {
      widthGridUnits: 5,
      heightGridUnits: 2
    }
  },
  select: {
    id: '1',
    category: ELEMENT_TYPES.FORM_FIELDS,
    type: 'select',
    component: {
      render: Input,
      icon: TextSearch,
      title: 'Select'
    },
    settings: {
      properties: {
        name: 'select-0',
        label: 'Select',
      },
      attributes: {
        placeholder: 'Enter input text'
      }
    },
    layout: {
      widthGridUnits: 4,
      heightGridUnits: 2
    }
  }
}
export default fields
export type FieldSettings = typeof fields[keyof typeof fields]
