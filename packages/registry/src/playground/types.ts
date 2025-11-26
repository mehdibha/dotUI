/**
 * Control types for interactive demos/playgrounds.
 * Controls define what props the user can modify in the playground.
 */

export interface BaseControl {
  name: string;
  label?: string;
  /** Always show this prop in code output, even if it equals the default value */
  alwaysShow?: boolean;
}

export interface BooleanControl extends BaseControl {
  type: "boolean";
  defaultValue?: boolean;
}

export interface StringControl extends BaseControl {
  type: "string";
  defaultValue?: string;
  placeholder?: string;
}

export interface NumberControl extends BaseControl {
  type: "number";
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface EnumControl extends BaseControl {
  type: "enum";
  options: string[];
  defaultValue?: string;
}

export interface IconControl extends BaseControl {
  type: "icon";
}

export type Control =
  | BooleanControl
  | StringControl
  | NumberControl
  | EnumControl
  | IconControl;

export type ControlValues = Record<string, unknown>;
