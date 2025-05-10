import type { FormValidated } from "$src/lib/interfaces";
import type { entitySchema } from "$src/schemas";

type EntityFormData = FormValidated<typeof entitySchema>['data']

function entityFindFieldIdx({ $entityFormData, entityKey, id }: { $entityFormData: EntityFormData, entityKey: keyof EntityFormData['fields'][0], id: string }) {
  return $entityFormData.fields.findIndex((field) => field[entityKey]['id'] === id);
}

export default function({ $entityFormData, fieldKey, field }:
  { $entityFormData: EntityFormData, fieldKey: keyof EntityFormData['fields'][0], field: EntityFormData['fields'][0] }) {
  let id = field[fieldKey]['id']
  if (!id) {
    throw Error("Id not found")
  }
  let idx = entityFindFieldIdx({
    $entityFormData,
    entityKey: 'properties',
    id
  });
  if (idx >= 0) {
    $entityFormData.fields[idx] = field;
  } else {
    $entityFormData.fields = [...$entityFormData.fields, field];
  }
  return $entityFormData
}
