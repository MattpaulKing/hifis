import { getContext, setContext } from "svelte";
import type { BuildableField } from "./fields";

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

class BuildableFormFieldMenu {
  state = $state<BuildableFieldMenuState>({
    field: null,
    tab: "field-list",
    label: "Elements"
  })

  setActiveField(item: BuildableField) {
    this.state = {
      field: item,
      tab: 'properties',
      label: `${item.properties.fieldType} Settings`
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
