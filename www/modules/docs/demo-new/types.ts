export type ControlValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | null
  | undefined;

interface BaseControl {
  name: string;
  label?: string;
  description?: string;
  defaultValue?: ControlValue;
}

export interface BooleanControl extends BaseControl {
  type: "boolean";
  defaultValue?: boolean;
}

export interface SelectOption {
  label?: string;
  value: string;
}

export interface SelectControl extends BaseControl {
  type: "select";
  options: Array<SelectOption | string>;
  defaultValue?: string;
}

export interface NumberControl extends BaseControl {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  mode?: "input" | "slider";
  defaultValue?: number;
}

export interface StringControl extends BaseControl {
  type: "string";
  placeholder?: string;
  defaultValue?: string;
}

export interface SlotControl extends BaseControl {
  type: "slots";
  slots?: {
    text?: boolean;
    icon?: boolean;
    avatar?: boolean;
    badge?: boolean;
  };
}

export type DemoControl =
  | BooleanControl
  | SelectControl
  | NumberControl
  | StringControl
  | SlotControl;

export type NormalizedSelectControl = SelectControl & {
  options: SelectOption[];
  defaultValue?: string;
};

export type NormalizedDemoControl =
  | BooleanControl
  | NormalizedSelectControl
  | NumberControl
  | StringControl
  | SlotControl;

export type DemoControlsMap = Record<string, NormalizedDemoControl>;
