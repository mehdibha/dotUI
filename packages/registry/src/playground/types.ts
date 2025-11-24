/**
 * Control types for interactive demos/playgrounds.
 * Controls define what props the user can modify in the playground.
 */

export interface BooleanControl {
  type: "boolean";
  name: string;
  label?: string;
  defaultValue?: boolean;
}

export interface StringControl {
  type: "string";
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
}

export interface NumberControl {
  type: "number";
  name: string;
  label?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface EnumControl {
  type: "enum";
  name: string;
  label?: string;
  options: string[];
  defaultValue?: string;
}

export interface IconControl {
  type: "icon";
  name: string;
  label?: string;
}

export type Control =
  | BooleanControl
  | StringControl
  | NumberControl
  | EnumControl
  | IconControl;

export type ControlValues = Record<string, unknown>;

