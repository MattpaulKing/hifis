import type { FormOptions, Infer, Schema, SuperValidated } from "sveltekit-superforms";

export type FormValidated<T extends Schema> = SuperValidated<Infer<T>>
export type FormOpts<T extends Schema> = FormOptions<Infer<T>>;
