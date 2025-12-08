import type {
  ColorTokens,
  Fonts,
  IconLibrary,
  ModeDefinition,
  StyleDefinition,
  ThemeDefinition,
  Variants,
  VariantsDefinition,
} from "@dotui/style-system";

import { registry } from "./registry";
import { COLOR_TOKENS } from "./tokens/registry";

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
  buttons: "basic",
  loader: "ring",
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
  card: "basic",
  skeleton: "basic",

  "focus-style": "basic",
};

export const DEFAULT_VARIANTS = Object.fromEntries(
  registry
    .filter((item) => item.defaultVariant !== undefined)
    .map((item) => [item.name, item.defaultVariant]),
) as unknown as Variants;

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

export const SCALE_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export const DEFAULT_LIGHT_MODE: ModeDefinition = {
  lightness: 97,
  saturation: 100,
  contrast: 100,
  scales: {
    neutral: {
      name: "neutral",
      colorKeys: ["#ffffff"],
      ratios: [1.05, 1.15, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    accent: {
      name: "accent",
      colorKeys: ["#0091FF"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    success: {
      name: "success",
      colorKeys: ["#1A9338"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    warning: {
      name: "warning",
      colorKeys: ["#E79D13"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    danger: {
      name: "danger",
      colorKeys: ["#D93036"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    info: {
      name: "info",
      colorKeys: ["#0091FF"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
  },
};

export const DEFAULT_DARK_MODE: ModeDefinition = {
  lightness: 3,
  saturation: 100,
  contrast: 100,
  scales: {
    neutral: {
      name: "neutral",
      colorKeys: ["#000000"],
      ratios: [1, 1.15, 1.25, 1.7, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    accent: {
      name: "accent",
      colorKeys: ["#0091FF"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    success: {
      name: "success",
      colorKeys: ["#1A9338"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    warning: {
      name: "warning",
      colorKeys: ["#E79D13"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    danger: {
      name: "danger",
      colorKeys: ["#D93036"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
    info: {
      name: "info",
      colorKeys: ["#0091FF"],
      ratios: [1.25, 1.35, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
      overrides: {},
      smooth: false,
    },
  },
};

export const DEFAULT_TOKENS: ColorTokens = Object.fromEntries(
  Object.entries(COLOR_TOKENS).map(([key, value]) => [
    key,
    {
      name: key,
      value: value.defaultValue,
    },
  ]),
);

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
