import type { FormOpts, FormValidated } from "$src/lib/interfaces/forms";
import type { entityFieldsSchema, entitySchema } from "$src/schemas";
import type { TaintedFieldInputs } from "$lib/components/user-grid";
import type { Toaster } from "$src/lib/components/toast"
import type { Writable } from "svelte/store";

export function entityFormOpts({ taintedFieldInputs }: { taintedFieldInputs: TaintedFieldInputs }): FormOpts<typeof entitySchema> {
  return {
    invalidateAll: false,
    applyAction: false,
    onUpdate({ form }) {
      if (!form.valid) return;
      taintedFieldInputs.reset({ key: "fieldInputs" });
      taintedFieldInputs.reset({ key: "fieldBlocks" });
    }
  }
}
export function entityFieldsFormOpts({ entityFormData, taintedFieldInputs, toaster }: { entityFormData: Writable<FormValidated<typeof entitySchema>['data']>, taintedFieldInputs: TaintedFieldInputs, toaster: Toaster }): FormOpts<typeof entityFieldsSchema> {
  return {
    invalidateAll: true,
    applyAction: false,
    onUpdate({ form }) {
      entityFormData.update((data) => {
        const idx = data.fieldInputs.findIndex(
          ({ properties: { id } }) => id === form.data.id
        );
        if (idx < 0) return data;
        data.fieldInputs[idx].properties = form.data
        if (form.data.id && form.data.id in taintedFieldInputs.fields) {
          delete taintedFieldInputs.fields.fieldInputs[form.data.id];
        }
        toaster.add({ type: 'save', message: 'Saved' });
        return data
      })
    }
  }
}
