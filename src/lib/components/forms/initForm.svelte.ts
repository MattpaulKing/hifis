import { valibot } from "sveltekit-superforms/adapters"
import { superForm, type FormOptions, type Infer, type SuperValidated } from "sveltekit-superforms"
import { getFormMsgStore } from "."
import { getModalStore } from "../modal"
import { getDrawerStore } from "../drawer"
import type { ErrorMessage, ObjectEntries, ObjectIssue, ObjectSchema } from "valibot"

export type ISchema = ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>

export default function <T extends ISchema>({ form, schema, opts }:
  { form: SuperValidated<Infer<T>, any, Infer<T>>, schema: T, opts?: FormOptions<Infer<T>, any, Infer<T>> }
) {
  let msgStore = getFormMsgStore()
  let modalStore = getModalStore()
  let drawerStore = getDrawerStore()
  return superForm(form, {
    //@ts-ignore
    id: form.data.id ?? crypto.randomUUID(),
    validators: valibot(schema),
    dataType: "json",
    applyAction: true,
    errorSelector: '[aria-invalid="true"],[data-invalid]',
    scrollToError: "smooth" as const,
    stickyNavbar: ".app-bar" as const,
    delayMs: 700,
    timeoutMs: 8000,
    resetForm: false,
    invalidateAll: true,
    // ...opts,
    onResult(e) {
      if (e.result.type === "success") {
        msgStore.setMsg({ id: form.id, msg: "Success", status: "success" })
        modalStore.queue[0]?.response({ type: "save" })
        drawerStore.queue[0]?.response({ type: 'save' })
      } else if (e.result.type === "error" || e.result.type === "failure") {
        msgStore.setMsg({ id: form.id, msg: "Error", status: "error" })
      }
      if (opts?.onResult) {
        opts?.onResult(e)
      }
    },
  })
}
