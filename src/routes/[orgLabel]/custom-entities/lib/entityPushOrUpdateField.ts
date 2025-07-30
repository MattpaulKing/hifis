import type { FormValidated } from "$src/lib/interfaces";
import type { entitySchema } from "$src/schemas";

type EntityFormData = FormValidated<typeof entitySchema>['data']

function entityFindFieldIdx<T extends keyof Pick<EntityFormData, "fieldInputs" | "fieldBlocks">>({ $entityFormData, entityKey, id }: { $entityFormData: EntityFormData, entityKey: T, id: string }) {
  return $entityFormData[entityKey].findIndex((field) => field['properties']['id'] === id);
}

export default function <T extends keyof EntityFormData & "fieldBlocks" | "fieldInputs">({ $entityFormData, fieldKey, field }:
  { $entityFormData: EntityFormData, fieldKey: T, field: EntityFormData[T][0] }) {
  let id = field['properties']['id']
  if (!id) {
    throw Error("Id not found")
  }
  let idx = entityFindFieldIdx({
    $entityFormData,
    entityKey: fieldKey,
    id
  });
  if (idx >= 0) {
    $entityFormData[fieldKey][idx] = field;
  } else {
    $entityFormData[fieldKey] = [...$entityFormData[fieldKey], field];
  }
  return $entityFormData
}
