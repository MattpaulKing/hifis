import type { FormValidated } from "$src/lib/interfaces"
import type { entitySchema } from "$src/schemas"

type TaintedFieldInputsMap = {
  'fieldInputs': Record<string, FormValidated<typeof entitySchema>['data']['fieldInputs'][0]['properties']>;
  'fieldBlocks': Record<string, FormValidated<typeof entitySchema>['data']['fieldBlocks'][0]['properties']>;
}

export default class TaintedFieldInputs {
  fields: TaintedFieldInputsMap = $state({
    fieldInputs: {},
    fieldBlocks: {}
  })
  hasEntries = $derived(Object.keys(this.fields).length > 0)

  constructor(taintedInputFields?: TaintedFieldInputsMap) {
    this.fields = taintedInputFields ?? this.fields
  }

  remove({ id, key }: { id: string, key: keyof TaintedFieldInputsMap }) {
    delete this.fields[key][id]
  }

  reset({ key }: { key: keyof TaintedFieldInputsMap }) {
    this.fields[key] = {}
  }

  getTaintedInputFields({ $entityFormData }:
    { $entityFormData: FormValidated<typeof entitySchema>['data'] }) {
    return $entityFormData.fieldInputs.map((field) => {
      if (field.properties.id && field.properties.id in this.fields) {
        return {
          properties: this.fields['fieldInputs'][field.properties.id],
          layout: field.layout
        };
      } else {
        return field;
      }
    })
  }
  getTaintedBlockFields({ $entityFormData }:
    { $entityFormData: FormValidated<typeof entitySchema>['data'] }) {
    return $entityFormData.fieldBlocks.map((field) => {
      if (field.properties.id && field.properties.id in this.fields) {
        return {
          properties: this.fields['fieldBlocks'][field.properties.id],
          layout: field.layout
        };
      } else {
        return field;
      }
    })
  }

}
