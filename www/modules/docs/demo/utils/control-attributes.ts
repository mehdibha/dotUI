import type {
  ControlValue,
  DemoControl,
} from "@/modules/docs/component-controls";

export const buildControlAttributes = (
  controls: DemoControl[],
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  const attributes: string[] = [];

  controls.forEach((control) => {
    const value = values[control.name];
    const defaultValue = defaults[control.name];

    if (!shouldRenderAttribute(control, value, defaultValue)) {
      return;
    }

    attributes.push(formatAttribute(control, value));
  });

  return attributes;
};

export const shouldRenderAttribute = (
  control: DemoControl,
  value: ControlValue,
  defaultValue: ControlValue,
) => {
  if (typeof value === "undefined" || value === null) {
    return false;
  }

  if (value === defaultValue) {
    return false;
  }

  if (control.type === "boolean") {
    return true;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  return true;
};

export const formatAttribute = (control: DemoControl, value: ControlValue) => {
  if (control.type === "boolean") {
    return value ? control.name : `${control.name}={false}`;
  }

  if (typeof value === "number") {
    return `${control.name}={${value}}`;
  }

  return `${control.name}="${value ?? ""}"`;
};
