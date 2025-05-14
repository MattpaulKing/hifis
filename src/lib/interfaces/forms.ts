import type { FormOptions, Infer, Schema, SuperForm, SuperValidated } from "sveltekit-superforms";

export type FormValidated<T extends Schema> = SuperValidated<Infer<T>>
export type FormInitialized<T extends Schema> = SuperForm<Infer<T>>
export type FormData<T extends Schema> = SuperValidated<Infer<T>>['data']
export type FormOpts<T extends Schema> = FormOptions<Infer<T>>;
