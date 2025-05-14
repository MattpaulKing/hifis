import type { FormOpts, FormValidated } from "$src/lib/interfaces/forms";
import type { entityFieldsSchema, entitySchema } from "$src/schemas";
import type { TaintedFieldInputs } from "$lib/components/user-grid";
import type { Toaster } from "$src/lib/components/toast"

export function entityFormOpts({ taintedFieldInputs }: { taintedFieldInputs: TaintedFieldInputs }): FormOpts<typeof entitySchema> {
  return {
    invalidateAll: false,
    applyAction: false,
    onUpdate({ form }) {
      if (!form.valid) return;
      taintedFieldInputs.reset();
    }
  }
}
export function entityFieldsFormOpts({ $entityFormData, taintedFieldInputs, toaster }: { $entityFormData: FormValidated<typeof entitySchema>['data'], taintedFieldInputs: TaintedFieldInputs, toaster: Toaster }): FormOpts<typeof entityFieldsSchema> {
  return {
    invalidateAll: false,
    applyAction: false,
    onUpdate({ form }) {
      const idx = $entityFormData.fields.findIndex(
        ({ properties: { id } }) => id === form.data.id
      );
      if (idx < 0) return;
      $entityFormData.fields[idx].properties = form.data;
      if (form.data.id && form.data.id in taintedFieldInputs.fields) {
        delete taintedFieldInputs.fields[form.data.id];
      }
      toaster.add({ type: 'save', message: 'Saved' });
    }
  }
}
