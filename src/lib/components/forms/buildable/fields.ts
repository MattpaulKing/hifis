import { ELEMENT_TYPES, Input } from "$lib/components/forms";

const fields = {
  input: {
    id: '0',
    category: ELEMENT_TYPES.FORM_FIELDS,
    type: 'input',
    component: {
      render: Input,
      icon: 'solar:text-square-line-duotone',
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
    }
  }
}
export default fields
