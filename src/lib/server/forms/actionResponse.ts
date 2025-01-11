import { message, type Infer, type SuperValidated } from "sveltekit-superforms"
import type { ISchema } from "$lib/components/forms/initClientForm.svelte"

export const ar = {
  invalid: ({ form, msg = 'Please check the fields for errors' }: { form: SuperValidated<Infer<ISchema>>, msg?: string }) => {
    return message(form, msg, { status: 400 })
  },
  dbError: ({ form, msg = 'Something went wrong on our end, please try again' }: { form: SuperValidated<Infer<ISchema>>, msg?: string }) => {
    return message(form, msg, { status: 500 })
  },
  success: ({ form, msg = 'Saved' }: { form: SuperValidated<Infer<ISchema>>, msg?: string }) => {
    return message(form, msg)
  },
}
