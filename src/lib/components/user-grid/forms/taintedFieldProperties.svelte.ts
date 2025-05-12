import type { FormValidated } from "$src/lib/interfaces"
import type { entitySchema } from "$src/schemas"

type TaintedFieldInputsMap = Record<string, FormValidated<typeof entitySchema>['data']['fields'][0]['properties']>

export default class TaintedFieldInputs {
  fields: TaintedFieldInputsMap = $state({})
  hasEntries = $derived(Object.keys(this.fields).length > 0)

  constructor({ taintedInputFields }: { taintedInputFields?: TaintedFieldInputsMap }) {
    this.fields = taintedInputFields ?? this.fields
  }

  remove(id: string) {
    delete this.fields[id]
  }

  reset() {
    this.fields = {}
  }

  getTaintedFields({ $entityFormData }:
    { $entityFormData: FormValidated<typeof entitySchema>['data'] }) {
    return $entityFormData.fields.map((field) => {
      if (field.properties.id && field.properties.id in this.fields) {
        return {
          properties: this.fields[field.properties.id],
          layout: field.layout
        };
      } else {
        return field;
      }
    })
  }
}
