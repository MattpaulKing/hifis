import type { FormValidated } from "$src/lib/interfaces";
import type { entityFieldSchema, entitySchema } from "$src/schemas";
import type { BuildableFormFieldMenu } from "./buildableFormFieldMenuState.svelte";

export default function({
  $entityFormData,
  entityFieldsFormData,
  fieldMenuState
}: {
  $entityFormData: FormValidated<typeof entitySchema>['data'];
  entityFieldsFormData: FormValidated<typeof entityFieldSchema>['data'];
  fieldMenuState: BuildableFormFieldMenu
}) {
  let idx = $entityFormData.fields.findIndex(
    ({ properties: { id } }) => id === entityFieldsFormData.id
  );
  if (idx >= 0) {
    $entityFormData.fields[idx].properties = entityFieldsFormData;
  } else if (fieldMenuState.state.field) {
    $entityFormData.fields = [
      ...$entityFormData.fields,
      {
        properties: entityFieldsFormData,
        layout: fieldMenuState.state.field.layout
      }
    ];
  } else {
    throw Error("No layout")
  }
  return $entityFormData
}
