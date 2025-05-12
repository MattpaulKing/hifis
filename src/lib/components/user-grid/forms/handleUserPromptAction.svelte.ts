import { goto } from "$app/navigation";
import type { BeforeNavigate } from "@sveltejs/kit";
import type { ModalResponse } from "../../modal/store.svelte";
import type { FormValidated } from "$src/lib/interfaces";
import type { entityFieldsSchema } from "$src/schemas";
import type { TaintedFieldInputs } from "$lib/components/user-grid";

export default async function({ userAction, nav, $entityFieldsFormData, taintedFieldInputs }: { userAction: ModalResponse, nav: BeforeNavigate, $entityFieldsFormData: FormValidated<typeof entityFieldsSchema>['data'], taintedFieldInputs: TaintedFieldInputs }) {
  if (!nav.to?.url) return
  if (userAction.type === 'save') {
    return await goto(`${nav.to.url}?prompted=true`, { invalidateAll: true });
  } else if (userAction.type === 'navigate') {
    return await goto(`${nav.to.url}?prompted=true`, { invalidateAll: true });
  } else if ($entityFieldsFormData.id) {
    taintedFieldInputs.fields[$entityFieldsFormData.id] = $entityFieldsFormData;
  }
}
