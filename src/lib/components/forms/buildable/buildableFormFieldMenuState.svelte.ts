import { getContext, setContext } from "svelte";
import type { BuildableField } from "./fields";
import type { FormValidated } from "$src/lib/interfaces";
import type { entityFieldsSchema, entitySchema } from "$src/schemas";

export type BuildableFieldMenuState =
  | {
    field: null;
    tab: 'field-list';
    label: string;
  }
  | {
    field: BuildableField;
    tab: 'properties' | 'layout';
    label: string;
  };

export class BuildableFormFieldMenu {
  state = $state<BuildableFieldMenuState>({
    field: null,
    tab: "field-list",
    label: "Elements"
  })

  setInputField(field: FormValidated<typeof entitySchema>['data']['fields'][0]) {
    this.state = {
      field: field,
      tab: 'properties',
      label: `${field.properties.fieldType} Settings`
    }
  }
  default() {
    this.state = {
      field: null,
      tab: "field-list",
      label: "Elements"
    }
  }
}
const BUILDABLE_FORM_FIELD_MENU_STATE_CTX = "BUILDABLE_FORM_FIELD_MENU_STATE_CTX "
export function setBuildableFormFieldMenuState() {
  return setContext(BUILDABLE_FORM_FIELD_MENU_STATE_CTX, new BuildableFormFieldMenu())
}
export function getBuildableFormFieldMenuState() {
  return getContext<BuildableFormFieldMenu>(BUILDABLE_FORM_FIELD_MENU_STATE_CTX)
}
