import type { Infer, Schema, SuperValidated } from "sveltekit-superforms";

export type FormValidated<T extends Schema> = SuperValidated<Infer<T>>
