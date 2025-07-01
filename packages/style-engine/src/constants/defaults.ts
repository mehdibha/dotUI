import type {
  Fonts,
  IconLibrary,
  ThemeModeDefinition,
  Variants,
} from "../types";

export const DEFAULT_RADIUS_FACTOR = 1;

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

export const DEFAULT_LIGHT_FOUNDATIONS = {
  lightness: 97,
  saturation: 100,
  colors: {
    neutral: {
      baseColors: ["#000000"],
      ratios: [1.05, 1.25, 1.7, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    accent: {
      baseColors: ["#0091FF"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    success: {
      baseColors: ["#1A9338"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    warning: {
      baseColors: ["#E79D13"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    danger: {
      baseColors: ["#D93036"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    info: {
      baseColors: ["#0091FF"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
  },
} as const satisfies ThemeModeDefinition;

export const DEFAULT_DARK_FOUNDATIONS = {
  lightness: 0,
  saturation: 100,
  colors: {
    neutral: {
      baseColors: ["#ffffff"],
      ratios: [1, 1.25, 1.7, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    accent: {
      baseColors: ["#0091FF"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    success: {
      baseColors: ["#1A9338"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    warning: {
      baseColors: ["#E79D13"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    danger: {
      baseColors: ["#D93036"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
    info: {
      baseColors: ["#0091FF"],
      ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
    },
  },
} as const satisfies ThemeModeDefinition;

export const DEFAULT_THEME: Record<string, string> = {
  "font-body": "var(--font-body)",
  "font-heading": "var(--font-heading)",

  "color-bg": "var(--neutral-100)",
  "color-bg-muted": "var(--neutral-200)",
  "color-bg-inverse": "var(--neutral-1000)",
  "color-bg-disabled": "var(--neutral-200)",

  "color-bg-neutral": "var(--neutral-200)",
  "color-bg-neutral-hover": "var(--neutral-300)",
  "color-bg-neutral-active": "var(--neutral-400)",

  "color-bg-primary": "var(--neutral-1000)",
  "color-bg-primary-hover": "var(--neutral-900)",
  "color-bg-primary-active": "var(--neutral-800)",
  "color-bg-primary-muted": "var(--neutral-200)",

  "color-bg-success": "var(--success-500)",
  "color-bg-success-hover": "var(--success-600)",
  "color-bg-success-active": "var(--success-700)",
  "color-bg-success-muted": "var(--success-200)",

  "color-bg-warning": "var(--warning-500)",
  "color-bg-warning-hover": "var(--warning-600)",
  "color-bg-warning-active": "var(--warning-700)",
  "color-bg-warning-muted": "var(--warning-200)",

  "color-bg-danger": "var(--danger-500)",
  "color-bg-danger-hover": "var(--danger-600)",
  "color-bg-danger-active": "var(--danger-700)",
  "color-bg-danger-muted": "var(--danger-200)",

  "color-bg-info": "var(--info-500)",
  "color-bg-info-hover": "var(--info-600)",
  "color-bg-info-active": "var(--info-700)",
  "color-bg-info-muted": "var(--info-200)",

  "color-bg-accent": "var(--accent-500)",
  "color-bg-accent-hover": "var(--accent-600)",
  "color-bg-accent-active": "var(--accent-700)",
  "color-bg-accent-muted": "var(--accent-200)",
  "color-bg-accent-muted-hover": "var(--accent-300)",

  "color-fg": "var(--neutral-1000)",
  "color-fg-muted": "var(--neutral-800)",
  "color-fg-inverse": "var(--neutral-100)",
  "color-fg-disabled": "var(--neutral-500)",
  "color-fg-danger": "var(--danger-700)",
  "color-fg-warning": "var(--warning-700)",
  "color-fg-success": "var(--success-700)",
  "color-fg-info": "var(--info-700)",
  "color-fg-accent": "var(--accent-700)",

  "color-fg-onNeutral": "var(--neutral-1000)",
  "color-fg-onPrimary": "var(--neutral-100)",
  "color-fg-onAccent": "var(--neutral-1000)",
  "color-fg-onSuccess": "var(--neutral-1000)",
  "color-fg-onDanger": "var(--neutral-1000)",
  "color-fg-onWarning": "var(--neutral-1000)",
  "color-fg-onInfo": "var(--neutral-1000)",

  "color-border": "var(--neutral-300)",
  "color-border-hover": "var(--neutral-400)",
  "color-border-field": "var(--neutral-400)",
  "color-border-control": "var(--neutral-700)",
  "color-border-disabled": "var(--neutral-300)",
  "color-border-focus": "var(--accent-500)",

  "color-border-success": "var(--success-300)",
  "color-border-accent": "var(--accent-300)",
  "color-border-danger": "var(--danger-300)",
  "color-border-warning": "var(--warning-300)",
  "color-border-info": "var(--info-300)",

  "radius-xs": "calc(0.125rem * var(--radius-factor))",
  "radius-sm": "calc(0.25rem * var(--radius-factor))",
  "radius-md": "calc(0.375rem * var(--radius-factor))",
  "radius-lg": "calc(0.5rem * var(--radius-factor))",
  "radius-xl": "calc(0.75rem * var(--radius-factor))",
  "radius-2xl": "calc(1rem * var(--radius-factor))",
  "radius-3xl": "calc(1.5rem * var(--radius-factor))",
  "radius-4xl": "calc(2rem * var(--radius-factor))",
};
