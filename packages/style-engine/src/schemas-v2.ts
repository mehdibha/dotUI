import { z } from "zod/v4";

import { DESIGN_TOKENS } from "@dotui/registry-definition/registry-tokens";

// ---------------------------------  Defintions  ----------------------------------- //

// Colors
export const colorScaleSchema = z.object({
  colorKeys: z
    .array(
      z.object({
        id: z.number(),
        color: z.string(),
      }),
    )
    .min(1),
  ratios: z.array(z.number().min(0).max(1)),
  overrides: z.record(z.string(), z.string()),
});

export const modeDefinitionSchema = z.object({
  lightness: z.number().min(0).max(100),
  saturation: z.number().min(0).max(100),
  contrast: z.number().min(0).max(500),
  baseScales: z.object({
    neutral: colorScaleSchema,
    accent: colorScaleSchema,
  }),
  semanticScales: z.object({
    success: colorScaleSchema,
    warning: colorScaleSchema,
    danger: colorScaleSchema,
    info: colorScaleSchema,
  }),
});

export const colorTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
});

type ColorTokenNames = Extract<
  (typeof DESIGN_TOKENS)[number],
  { categories: readonly string[] }
>["name"];

// This approach will work better for type inference
const colorTokens = DESIGN_TOKENS.filter((token) =>
  token.categories.includes("color"),
) as const;

export const colorTokensSchema = z.object(
  Object.fromEntries(
    colorTokens.map((token) => [token.name, colorTokenSchema]),
  ) as Record<(typeof colorTokens)[number]["name"], typeof colorTokenSchema>,
);

// keep this for testing
type ColorTokens = z.infer<typeof colorTokensSchema>;
const colorTokensTest: ColorTokens = {
  "color-1": {
    name: "color-1",
    value: "#000000",
  },
};

export const themeDefinitionSchema = z.object({
  colors: z.object({
    mode: z.enum(["light-dark", "light-only", "dark-only"]),
    light: modeDefinitionSchema,
    dark: modeDefinitionSchema,
    tokens: colorTokensSchema,
  }),
  radius: z.number().min(0).max(2),
  spacing: z.number().min(0.1).max(0.35),
  fonts: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
  }),
  letterSpacing: z.number().min(0).max(0.1),
  backgroundPattern: z.string(),
  texture: z.string(),
  shadows: z.object({
    color: z.string(),
    opacity: z.number().min(0).max(1),
    blurRadius: z.number().min(0).max(100),
    offsetX: z.number().min(0).max(100),
    offsetY: z.number().min(0).max(100),
    spread: z.number().min(0).max(100),
  }),
});

export const minimizedThemeSchema = z.object({
  colors: z.object({
    mode: z.enum(["light-dark", "light-only", "dark-only"]),
    light: modeDefinitionSchema,
    dark: modeDefinitionSchema,
    // tokens:
  }),
});

// Icons
export const iconLibrarySchema = z.enum([
  "lucide",
  "heroicons",
  "material-icons",
  "custom",
]);
export const iconsDefinitionSchema = z.object({
  library: iconLibrarySchema,
  strokeWidth: z.number().min(0.5).max(3),
});

// Variants
export const variantsDefinitionSchema = z.object({
  alert: z.enum(["basic", "notch", "notch-2"]),
  buttons: z.enum(["basic"]),
  loader: z.enum(["ring"]),
  "focus-style": z.enum(["basic"]),
  inputs: z.enum(["basic"]),
  pickers: z.enum(["basic"]),
  selection: z.enum(["basic"]),
  calendars: z.enum(["basic"]),
  "list-box-and-menu": z.enum(["basic"]),
  overlays: z.enum(["basic"]),
  checkboxes: z.enum(["basic"]),
  radios: z.enum(["basic"]),
  switch: z.enum(["basic"]),
  slider: z.enum(["basic"]),
  "badge-and-tag-group": z.enum(["basic"]),
  tooltip: z.enum(["basic"]),
});

export const styleDefinitionSchema = z.object({
  theme: themeDefinitionSchema,
  icons: iconsDefinitionSchema,
  variants: variantsDefinitionSchema,
});

// ---------------------------------  Processed  ----------------------------------- //

const CssSchema = z.record(
  z.string(),
  z.union([
    z.string(),
    z.record(
      z.string(),
      z.union([z.string(), z.record(z.string(), z.string())]),
    ),
  ]),
);

// Theme will include all the cssVars and css need for colors, radius, spacing, fonts, backgroundPattern, texture and shadows.
export const themeSchema = z.object({
  css: CssSchema,
  cssVars: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string()),
    theme: z.record(z.string(), z.string()),
  }),
});

export const variantsSchema = z.object({
  alert: z.enum(["basic", "notch", "notch-2"]).optional(),
  avatar: z.enum(["basic"]).optional(),
  badge: z.enum(["basic"]).optional(),
  breadcrumbs: z.enum(["basic"]).optional(),
  button: z.enum(["basic", "outline", "brutalist", "ripple"]).optional(),
  "button-group": z.enum(["basic"]).optional(),
  calendar: z.enum(["basic", "cal"]).optional(),
  checkbox: z.enum(["basic"]).optional(),
  "checkbox-group": z.enum(["basic"]).optional(),
  "color-area": z.enum(["basic"]).optional(),
  "color-field": z.enum(["basic"]).optional(),
  "color-picker": z.enum(["basic"]).optional(),
  "color-slider": z.enum(["basic"]).optional(),
  "color-swatch": z.enum(["basic"]).optional(),
  "color-swatch-picker": z.enum(["basic"]).optional(),
  "color-thumb": z.enum(["basic"]).optional(),
  combobox: z.enum(["basic"]).optional(),
  command: z.enum(["basic"]).optional(),
  "date-field": z.enum(["basic"]).optional(),
  "date-input": z.enum(["basic"]).optional(),
  "date-picker": z.enum(["basic"]).optional(),
  "date-range-picker": z.enum(["basic"]).optional(),
  dialog: z.enum(["basic"]).optional(),
  drawer: z.enum(["basic"]).optional(),
  "drop-zone": z.enum(["basic"]).optional(),
  field: z.enum(["basic"]).optional(),
  "file-trigger": z.enum(["basic"]).optional(),
  form: z.enum(["basic", "react-hook-form"]).optional(),
  input: z.enum(["basic"]).optional(),
  kbd: z.enum(["basic"]).optional(),
  "list-box": z.enum(["basic"]).optional(),
  loader: z.enum(["dots", "line", "ring", "tailspin", "wave"]).optional(),
  menu: z.enum(["basic"]).optional(),
  modal: z.enum(["basic", "blur"]).optional(),
  "number-field": z.enum(["basic"]).optional(),
  overlay: z.enum(["basic"]).optional(),
  popover: z.enum(["basic"]).optional(),
  "progress-bar": z.enum(["basic"]).optional(),
  "radio-group": z.enum(["basic"]).optional(),
  ripple: z.enum(["basic"]).optional(),
  "search-field": z.enum(["basic"]).optional(),
  select: z.enum(["basic"]).optional(),
  separator: z.enum(["basic"]).optional(),
  skeleton: z.enum(["basic"]).optional(),
  slider: z.enum(["basic"]).optional(),
  switch: z.enum(["basic"]).optional(),
  table: z.enum(["basic"]).optional(),
  tabs: z.enum(["basic", "motion"]).optional(),
  "tag-group": z.enum(["basic"]).optional(),
  text: z.enum(["basic"]).optional(),
  "text-area": z.enum(["basic"]).optional(),
  "text-field": z.enum(["basic"]).optional(),
  "time-field": z.enum(["basic"]).optional(),
  "toggle-button": z.enum(["basic"]).optional(),
  "toggle-button-group": z.enum(["basic"]).optional(),
  tooltip: z.enum(["basic", "motion"]).optional(),
});

export const styleSchema = z.object({
  theme: themeSchema, // used in {styleName}/theme
  icons: iconsDefinitionSchema, // used in {styleName}/base and {styleName}/{componentName}
  variants: variantsSchema, // used in {styleName}/{componentName}
});
