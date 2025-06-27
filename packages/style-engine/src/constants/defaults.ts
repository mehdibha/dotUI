import type { Fonts, IconLibrary, StyleDefinition, Variants } from "../types";

export const DEFAULT_ICON_LIBRARY: IconLibrary = "lucide";

export const DEFAULT_FONTS: Fonts = {
  heading: "Inter",
  body: "Inter",
};

export const DEFAULT_VARIANTS: Variants = {
  alert: "basic",

  avatar: "basic",

  badge: "basic",

  breadcrumbs: "basic",
  menu: "basic",
  tabs: "basic",

  button: "basic",
  "button-group": "basic",
  "toggle-button": "basic",
  "toggle-button-group": "basic",

  input: "basic",
  "text-area": "basic",
  "text-field": "basic",
  "number-field": "basic",
  "search-field": "basic",
  checkbox: "basic",
  "checkbox-group": "basic",
  "radio-group": "basic",
  select: "basic",
  combobox: "basic",
  switch: "basic",
  slider: "basic",

  calendar: "basic",
  "date-field": "basic",
  "date-input": "basic",
  "date-picker": "basic",
  "date-range-picker": "basic",
  "time-field": "basic",

  "color-area": "basic",
  "color-field": "basic",
  "color-picker": "basic",
  "color-slider": "basic",
  "color-swatch": "basic",
  "color-swatch-picker": "basic",
  "color-thumb": "basic",

  dialog: "basic",
  drawer: "basic",
  modal: "basic",
  overlay: "basic",
  popover: "basic",
  separator: "basic",

  table: "basic",
  "list-box": "basic",

  "drop-zone": "basic",
  "file-trigger": "basic",

  loader: "dots",
  "progress-bar": "basic",
  skeleton: "basic",
  tooltip: "basic",

  form: "basic",
  field: "basic",

  command: "basic",
  ripple: "basic",

  text: "basic",
  "tag-group": "basic",
  kbd: "basic",
};

export const DEFAULT_STYLE_DEFINITION: StyleDefinition = {
  iconLibrary: DEFAULT_ICON_LIBRARY,
  fonts: DEFAULT_FONTS,
  variants: DEFAULT_VARIANTS,
};

export function mergeWithDefaults(partial: {
  iconLibrary?: IconLibrary;
  fonts?: Partial<Fonts>;
  variants?: Partial<Variants>;
}): StyleDefinition {
  return {
    iconLibrary: partial.iconLibrary ?? DEFAULT_ICON_LIBRARY,
    fonts: {
      ...DEFAULT_FONTS,
      ...partial.fonts,
    },
    variants: {
      ...DEFAULT_VARIANTS,
      ...partial.variants,
    },
  };
}

export function getDifferencesFromDefaults(style: StyleDefinition): {
  iconLibrary?: IconLibrary;
  fonts?: Partial<Fonts>;
  variants?: Partial<Variants>;
} {
  const result: {
    iconLibrary?: IconLibrary;
    fonts?: Partial<Fonts>;
    variants?: Partial<Variants>;
  } = {};

  // Only include iconLibrary if different from default
  if (style.iconLibrary !== DEFAULT_ICON_LIBRARY) {
    result.iconLibrary = style.iconLibrary;
  }

  // Only include font properties that differ from defaults
  const fontDiffs: Partial<Fonts> = {};
  if (style.fonts.heading !== DEFAULT_FONTS.heading) {
    fontDiffs.heading = style.fonts.heading;
  }
  if (style.fonts.body !== DEFAULT_FONTS.body) {
    fontDiffs.body = style.fonts.body;
  }
  if (Object.keys(fontDiffs).length > 0) {
    result.fonts = fontDiffs;
  }

  // Only include variant properties that differ from defaults
  const variantDiffs: Partial<Variants> = {};
  for (const [key, value] of Object.entries(style.variants)) {
    const defaultValue = DEFAULT_VARIANTS[key as keyof Variants];
    if (value !== defaultValue) {
      (variantDiffs as any)[key] = value;
    }
  }
  if (Object.keys(variantDiffs).length > 0) {
    result.variants = variantDiffs;
  }

  return result;
}
