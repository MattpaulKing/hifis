import { valibot } from "sveltekit-superforms/adapters"
import { superForm, type FormOptions, type Infer, type SuperValidated } from "sveltekit-superforms"
import type { ObjectEntries, ObjectSchema } from "valibot"

type ISchema = ObjectSchema<ObjectEntries, string | undefined>

function defaultFormOptions<T extends ISchema>(validator: T) {
  return {
    validators: valibot(validator),
    dataType: "json",
    errorSelector: '[aria-invalid="true"],[data-invalid]',
    scrollToError: "smooth" as const,
    stickyNavbar: ".app-bar" as const,
    delayMs: 700,
    timeoutMs: 8000,
    resetForm: false,
    invalidateAll: false
  } as FormOptions<Infer<T>, any, Infer<T>>
}

export default function <T extends ISchema>({ form, schema, opts = {} }:
  { form: SuperValidated<Infer<T>, any, Infer<T>>, schema: T, opts?: FormOptions<Infer<T>, any, Infer<T>> }
) {
  return superForm(form, {
    ...defaultFormOptions(schema),
    ...opts
  })
}
