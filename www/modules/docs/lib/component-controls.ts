export type ControlValue = string | number | boolean | null | undefined;

type BooleanControl = {
  name: string;
  type: "boolean";
  defaultValue?: boolean;
};

type SelectControl = {
  name: string;
  type: "select";
  options: string[];
  defaultValue?: string;
};

export type ComponentPreviewControl = BooleanControl | SelectControl;

export const buildControlDefaults = (
  controls?: ComponentPreviewControl[],
) => {
  if (!controls?.length) {
    return {};
  }

  return controls.reduce<Record<string, ControlValue>>((acc, control) => {
    acc[control.name] = getControlDefaultValue(control);
    return acc;
  }, {});
};

export const getControlDefaultValue = (
  control: ComponentPreviewControl,
): ControlValue => {
  if (control.type === "boolean") {
    return typeof control.defaultValue === "boolean"
      ? control.defaultValue
      : false;
  }

  if (control.type === "select") {
    if (typeof control.defaultValue === "string") {
      return control.defaultValue;
    }

    return control.options[0] ?? "";
  }

  return "";
};

export const areControlValuesEqual = (
  prev: Record<string, ControlValue>,
  next: Record<string, ControlValue>,
) => {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  return nextKeys.every((key) => Object.is(prev[key], next[key]));
};

