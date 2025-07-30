import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";
import { arrayProxy, formFieldProxy, type ArrayProxy, type FormFieldProxy, type FormPathArrays, type FormPathLeaves, type SuperForm } from "sveltekit-superforms";

const FORM_CTX = Symbol("DISABLED")
export function setFormCtx<T extends Record<string, unknown>>(props: { form: SuperForm<T>, disabled: boolean }) {
  return setContext(FORM_CTX, {
    form: props.form,
    disabled: writable(props.disabled)
  })
}
export function getFormCtx(): ReturnType<typeof setFormCtx> {
  return getContext(FORM_CTX)
}

const FIELD_CTX = "FIELD_CTX"
export function setArrayField<T extends Record<string, unknown>>({ form, path }: { form: SuperForm<T>, path: FormPathArrays<T> }) {
  let { errors, values: value } = arrayProxy(form, path);
  return setContext(FIELD_CTX, {
    errors,
    value,
    constraints: writable({}),
    tainted: writable(undefined),
    path,
    focused: writable(false),
    searching: writable(false),
    disabled: writable(false),
    isArray: true,
  })
}
export function setField<T extends Record<string, unknown>>({ form, path }: { form: SuperForm<T>, path: FormPathLeaves<T> }) {
  let { errors, constraints, tainted, value } = formFieldProxy(form, path)
  return setContext(FIELD_CTX, {
    errors,
    value,
    constraints,
    tainted,
    path,
    focused: writable(false),
    searching: writable(false),
    disabled: writable(false),
    isArray: false
  })
}
type FormFieldMetadata = {
  focused: Writable<boolean>,
  searching: Writable<boolean>,
  disabled: Writable<boolean>,
  isArray: boolean
}
export function getField<T>() {
  return getContext(FIELD_CTX) as (FormFieldProxy<T> | (Omit<ArrayProxy<T>, "values"> & { value: Writable<T> })) & FormFieldMetadata
}
