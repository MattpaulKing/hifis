import { ModalConfirmation, openModal, type modalStore } from "../../modal";
import { page } from "$app/state";
import type { FormValidated } from "$src/lib/interfaces";
import type { entityFieldsSchema, entitySchema } from "$src/schemas";
import type { Infer, SuperForm } from "sveltekit-superforms";
import type { ModalResponse } from "../../modal/store.svelte";

export default async function({ entityFieldsFormTainted, modalStore, $entityFormData, entityForm }: { entityFieldsFormTainted: SuperForm<Infer<typeof entityFieldsSchema>>['isTainted'], modalStore: modalStore, $entityFormData: FormValidated<typeof entitySchema>['data'], entityForm: SuperForm<Infer<typeof entitySchema>> }): Promise<ModalResponse> {
  if (entityFieldsFormTainted()) {
    await openModal({
      modalStore,
      id: $entityFormData.id,
      ref: ModalConfirmation,
      props: () => ({
        id: $entityFormData.id,
        message: "There are changes that haven't been saved!"
      }),
      routes: { from: page.url.href, to: page.url.href }
    }).then((r) => {
      if (r?.type === 'save') {
        entityForm.submit();
        return r;
      }
      modalStore.close();
      return r;
    });
  }
  return { type: 'navigate' };
}
