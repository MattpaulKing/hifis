import { valibot } from "sveltekit-superforms/adapters"
import { superForm, type FormOptions, type Infer, type SuperValidated } from "sveltekit-superforms"
import { setFormMsgStore } from "."
import type { ObjectEntries, ObjectSchema } from "valibot"

export type ISchema = ObjectSchema<ObjectEntries, string | undefined>

function defaultFormOptions<T extends ISchema>(validator: T) {
  return {
    validators: valibot(validator),
    dataType: "json",
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
    onResult({ result }) {
      if (result.status && result?.status >= 400 && result?.status < 500) {
        msgStore.setMsg({ msg: "Invalid fields", status: "error" })
      } else if (result.status && result.status >= 500) {
        msgStore.setMsg({ msg: "Error", status: "error" })
      } else {
        console.log(result)
        msgStore.setMsg({ msg: "Success", status: "success" })
      }
    },
    ...opts
  })
}
