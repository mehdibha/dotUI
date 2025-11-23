import type {
  ControlValue,
  DemoControl,
  DemoControlsMap,
  NormalizedDemoControl,
  NormalizedSelectControl,
  SelectOption,
} from "./types";

const IMPORT_STATEMENT_REGEX = /^\s*import[\s\S]*?;\s*$/gm;
const FUNCTION_WRAPPER_REGEX =
  /export\s+(default\s+)?function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\(?\s*/m;
const FUNCTION_END_REGEX = /\s*\)?\s*;?\s*\}\s*$/m;
const PROPS_SPREAD_REGEX = /\{\s*\.\.\.props\s*\}/g;

export const normalizeControls = (
  controls?: DemoControl[],
): DemoControlsMap => {
  if (!controls?.length) {
    return {};
  }

  return controls.reduce<DemoControlsMap>((acc, control) => {
    if (!control?.name || acc[control.name]) {
      return acc;
    }

    const base: NormalizedDemoControl = {
      ...control,
      label: control.label ?? formatLabel(control.name),
    } as NormalizedDemoControl;

    if (control.type === "select") {
      const options = normalizeSelectOptions(control.options);
      const selectControl: NormalizedSelectControl = {
        ...base,
        type: "select",
        options,
        defaultValue:
          typeof control.defaultValue === "string"
            ? control.defaultValue
            : options[0]?.value,
      };
      acc[control.name] = selectControl;
      return acc;
    }

    acc[control.name] = base;
    return acc;
  }, {});
};

const formatLabel = (value: string) =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

const normalizeSelectOptions = (
  options: Array<SelectOption | string>,
): SelectOption[] => {
  return options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: formatLabel(option) };
    }

    return {
      value: option.value,
      label: option.label ?? formatLabel(option.value),
    };
  });
};

export const buildControlDefaults = (controls: DemoControlsMap) =>
  Object.entries(controls).reduce<Record<string, ControlValue>>(
    (acc, [name, control]) => {
      acc[name] = getDefaultValue(control);
      return acc;
    },
    {},
  );

const getDefaultValue = (control: NormalizedDemoControl): ControlValue => {
  if (typeof control.defaultValue !== "undefined") {
    return control.defaultValue;
  }

  switch (control.type) {
    case "boolean":
      return false;
    case "select":
      return control.options[0]?.value ?? "";
    case "number":
      return typeof control.min === "number" ? control.min : 0;
    case "string":
      return "";
    default:
      return undefined;
  }
};

export const controlsHaveValues = (controls: DemoControlsMap) =>
  Object.keys(controls).length > 0;

export const areControlValuesEqual = (
  prev: Record<string, ControlValue>,
  next: Record<string, ControlValue>,
) => {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  return nextKeys.every((key) => isValueEqual(prev[key], next[key]));
};

const isValueEqual = (a: ControlValue, b: ControlValue) => {
  if (typeof a === "object" || typeof b === "object") {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return Object.is(a, b);
};

export const buildControlAttributes = (
  controls: DemoControlsMap,
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) =>
  Object.entries(controls).reduce<string[]>((acc, [name, control]) => {
    const value = values[name];
    const defaultValue = defaults[name];
    if (!shouldRenderAttribute(value, defaultValue)) {
      return acc;
    }

    const formatted = formatAttribute(name, value, control);
    if (formatted) {
      acc.push(formatted);
    }

    return acc;
  }, []);

const shouldRenderAttribute = (
  value: ControlValue,
  defaultValue: ControlValue,
) => {
  if (typeof value === "undefined" || value === null) {
    return false;
  }

  if (isValueEqual(value, defaultValue)) {
    return false;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  return true;
};

const formatAttribute = (
  name: string,
  value: ControlValue,
  control: NormalizedDemoControl,
) => {
  if (control.type === "boolean") {
    return value ? name : `${name}={false}`;
  }

  if (typeof value === "number") {
    return `${name}={${value}}`;
  }

  if (typeof value === "string") {
    return `${name}="${value}"`;
  }

  if (value && typeof value === "object") {
    return `${name}={${JSON.stringify(value)}}`;
  }

  return null;
};

export const injectAttributesIntoSource = (
  source: string,
  attributes: string[],
) => {
  if (!attributes.length) {
    return source.trim();
  }

  const [firstAttribute] = attributes;
  const formatted =
    attributes.length === 1 &&
    typeof firstAttribute === "string" &&
    firstAttribute.length <= 40
      ? ` ${firstAttribute}`
      : `${attributes.map((attr) => `\n  ${attr}`).join("")}\n`;

  return source.replace(/<([A-Za-z][^>\s]*)/, `<$1${formatted}`).trim();
};

export const normalizeRegistrySource = (source: string) =>
  source
    .replaceAll("@dotui/registry/", "@/")
    .replace(/export\s+default\s+/g, "export ")
    .replace(/\r\n/g, "\n")
    .replace(/\s+$/, "");

export const extractPreviewSource = (source: string) =>
  source
    .replace(IMPORT_STATEMENT_REGEX, "")
    .replace(FUNCTION_WRAPPER_REGEX, "")
    .replace(FUNCTION_END_REGEX, "")
    .replace(PROPS_SPREAD_REGEX, "")
    .trim();

export const stripPropsTypeAnnotations = (source: string) =>
  source
    .replace(
      /(export\s+)?function\s+(\w+)\s*\(\s*props(?:\s*:\s*[^)]*)?\s*\)/g,
      (_match, exp: string | undefined, name: string) =>
        `${exp ?? ""}function ${name}()`,
    )
    .replace(/props\s*:\s*[^)\r\n]+/g, "props")
    .replace(PROPS_SPREAD_REGEX, "")
    .replace(/import\s+type\s+\{[^}]*\}\s+from\s+[^;]+;?\n?/g, "")
    .replace(/import\s+\{\s*\}\s+from\s+[^;]+;?\n?/g, "");

export const applyControlsToSource = (
  source: string,
  controls: DemoControlsMap,
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  if (!controlsHaveValues(controls)) {
    return source.trim();
  }

  const attributes = buildControlAttributes(controls, values, defaults);
  if (!attributes.length) {
    return stripPropsTypeAnnotations(source).trim();
  }

  const injected = injectAttributesIntoSource(source, attributes);
  return stripPropsTypeAnnotations(injected).trim();
};

export const parseControlValuesFromSearch = (
  controls: DemoControlsMap,
  search: string,
) => {
  if (!controlsHaveValues(controls) || !search) {
    return {};
  }

  const params = new URLSearchParams(
    search.startsWith("?") ? search : `?${search}`,
  );

  return Object.keys(controls).reduce<Record<string, ControlValue>>(
    (acc, name) => {
      if (!params.has(name)) {
        return acc;
      }

      const raw = params.get(name);
      if (raw === null) {
        return acc;
      }

      try {
        acc[name] = JSON.parse(raw);
      } catch {
        acc[name] = raw;
      }

      return acc;
    },
    {},
  );
};

export const buildShareableSearch = (
  controls: DemoControlsMap,
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  if (!controlsHaveValues(controls)) {
    return "";
  }

  const params = new URLSearchParams();
  Object.keys(controls).forEach((name) => {
    const value = values[name];
    const defaultValue = defaults[name];
    if (!shouldRenderAttribute(value, defaultValue)) {
      return;
    }

    params.set(name, JSON.stringify(value));
  });

  const query = params.toString();
  return query ? `?${query}` : "";
};
