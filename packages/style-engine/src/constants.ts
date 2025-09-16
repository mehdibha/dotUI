import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";

import type {
  ColorTokens,
  Fonts,
  IconLibrary,
  ModeDefinition,
  StyleDefinition,
  ThemeDefinition,
  Variants,
  VariantsDefinition,
} from "./types";

export const DEFAULT_RADIUS_FACTOR = 1;

export const DEFAULT_SPACING = 0.25;

export const DEFAULT_LETTER_SPACING = 0;

export const DEFAULT_BACKGROUND_PATTERN = "none";

export const DEFAULT_TEXTURE = "none";

export const DEFAULT_SHADOWS = "default";

export const DEFAULT_ICON_LIBRARY: IconLibrary = "lucide";
export const DEFAULT_ICON_STROKE_WIDTH = 2;

export const DEFAULT_ACCENT_EMPHASIS_LEVEL = 1;

export const DEFAULT_FONTS: Fonts = {
  heading: "Inter",
  body: "Inter",
};

export const DEFAULT_VARIANTS_DEFINITION: VariantsDefinition = {
  alert: "basic",
  buttons: "outline",
  loader: "ring",
  "focus-style": "basic",
  inputs: "basic",
  pickers: "basic",
  selection: "basic",
  calendars: "basic",
  "list-box-and-menu": "basic",
  overlays: "basic",
  checkboxes: "basic",
  radios: "basic",
  switch: "basic",
  slider: "basic",
  "badge-and-tag-group": "basic",
  tooltip: "basic",
  link: "basic",
};

export const DEFAULT_VARIANTS: Variants = {
  alert: "basic",

  avatar: "basic",

  badge: "basic",

  breadcrumbs: "basic",
  menu: "basic",
  tabs: "basic",
  link: "basic",

  button: "outline",
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
  toast: "basic",

  card: "basic",

  "focus-style": "basic",
};

export const DEFAULT_CSS = {
  "@layer base": {
    "*": {
      "border-color": "var(--color-border)",
    },
    body: {
      "background-color": "var(--color-bg)",
      color: "var(--color-fg)",
    },
  },
};

export const SCALE_NUMBERRS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export const DEFAULT_LIGHT_MODE: ModeDefinition = {
  lightness: 97,
  saturation: 100,
  contrast: 100,
  scales: {
    neutral: {
      name: "neutral",
      colorKeys: [{ id: 0, color: "#ffffff" }],
      ratios: [1.05, 1.15, 1.25, 1.7, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    accent: {
      name: "accent",
      colorKeys: [{ id: 0, color: "#0091FF" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    success: {
      name: "success",
      colorKeys: [{ id: 0, color: "#1A9338" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    warning: {
      name: "warning",
      colorKeys: [{ id: 0, color: "#E79D13" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    danger: {
      name: "danger",
      colorKeys: [{ id: 0, color: "#D93036" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    info: {
      name: "info",
      colorKeys: [{ id: 0, color: "#0091FF" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
  },
};

export const DEFAULT_DARK_MODE: ModeDefinition = {
  lightness: 0,
  saturation: 100,
  contrast: 100,
  scales: {
    neutral: {
      name: "neutral",
      colorKeys: [{ id: 0, color: "#000000" }],
      ratios: [1, 1.1, 1.25, 1.7, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    accent: {
      name: "accent",
      colorKeys: [{ id: 0, color: "#0091FF" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    success: {
      name: "success",
      colorKeys: [{ id: 0, color: "#1A9338" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    warning: {
      name: "warning",
      colorKeys: [{ id: 0, color: "#E79D13" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    danger: {
      name: "danger",
      colorKeys: [{ id: 0, color: "#D93036" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    info: {
      name: "info",
      colorKeys: [{ id: 0, color: "#0091FF" }],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
  },
};

export const DEFAULT_TOKENS: ColorTokens = COLOR_TOKENS.map((token) => ({
  id: token.name,
  name: token.name,
  value: token.defaultValue,
}));

export const DEFAULT_THEME: ThemeDefinition = {
  colors: {
    activeModes: ["light", "dark"],
    modes: {
      light: DEFAULT_LIGHT_MODE,
      dark: DEFAULT_DARK_MODE,
    },
    tokens: DEFAULT_TOKENS,
    accentEmphasisLevel: DEFAULT_ACCENT_EMPHASIS_LEVEL,
  },
  fonts: {
    heading: DEFAULT_FONTS.heading,
    body: DEFAULT_FONTS.body,
  },
  spacing: DEFAULT_SPACING,

  shadows: DEFAULT_SHADOWS,
  radius: DEFAULT_RADIUS_FACTOR,
  texture: DEFAULT_TEXTURE,
  backgroundPattern: DEFAULT_BACKGROUND_PATTERN,
  letterSpacing: DEFAULT_LETTER_SPACING,
};

export const DEFAULT_STYLE: StyleDefinition = {
  theme: DEFAULT_THEME,
  icons: {
    library: DEFAULT_ICON_LIBRARY,
    strokeWidth: DEFAULT_ICON_STROKE_WIDTH,
  },
  variants: DEFAULT_VARIANTS_DEFINITION,
};
