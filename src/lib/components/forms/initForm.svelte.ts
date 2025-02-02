import { valibot } from "sveltekit-superforms/adapters"
import { superForm, type FormOptions, type Infer, type SuperValidated } from "sveltekit-superforms"
import { setFormMsgStore } from "."
import type { ErrorMessage, ObjectEntries, ObjectIssue, ObjectSchema } from "valibot"

export type ISchema = ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>

function defaultFormOptions<T extends ISchema>(validator: T) {
  return {
    validators: valibot(validator),
    dataType: "json",
    applyAction: true,
    errorSelector: '[aria-invalid="true"],[data-invalid]',
    scrollToError: "smooth" as const,
    stickyNavbar: ".app-bar" as const,
    delayMs: 700,
    timeoutMs: 8000,
    resetForm: true,
    invalidateAll: true
  } as FormOptions<Infer<T>, any, Infer<T>>
}

export default function <T extends ISchema>({ form, schema, opts = {} }:
  { form: SuperValidated<Infer<T>, any, Infer<T>>, schema: T, opts?: FormOptions<Infer<T>, any, Infer<T>> }
) {
  let msgStore = setFormMsgStore()
  return superForm(form, {
    //@ts-ignore
    ...defaultFormOptions(schema),
    onUpdated({ form }) {
      if (form.valid) {
        msgStore.setMsg({ msg: "Success", status: "success" })
      } else {
        msgStore.setMsg({ msg: "Error", status: "error" })
      }
    },
    ...opts
  })
}
