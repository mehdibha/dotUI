import { z } from "zod/v4";

import { registryBackgroundPatterns } from "@dotui/registry-definition/registry-bg-patterns";
import { iconLibraries } from "@dotui/registry-definition/registry-icons";
import { registryTextures } from "@dotui/registry-definition/registry-textures";

// ---------------------------------  Definitions  ----------------------------------- //

// Icons
export const iconLibrarySchema = z.enum(iconLibraries.map((lib) => lib.name));
export const iconsDefinitionSchema = z.object({
  library: iconLibrarySchema,
  strokeWidth: z.number().min(0.5).max(3),
});

// Colors
export const colorScaleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  colorKeys: z
    .array(
      z.object({
        id: z.number(),
        color: z.string(),
      }),
    )
    .min(1),
  ratios: z.array(z.number().min(0)),
  overrides: z.record(z.string(), z.string()),
});

export const modeSchema = z.enum(["light", "dark"]);
const requiredScaleIds = [
  "neutral",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
];

export const modeDefinitionSchema = z.object({
  mode: modeSchema,
  lightness: z.number().min(0).max(100),
  saturation: z.number().min(0).max(100),
  contrast: z.number().min(0).max(500),
  scales: z
    .array(colorScaleSchema)
    .min(6)
    .refine(
      (scales) => {
        const scaleIds = scales.map((scale) => scale.id);
        return requiredScaleIds.every((id) => scaleIds.includes(id));
      },
      {
        message:
          "Must include all required scale IDs: neutral, accent, success, warning, danger, info",
      },
    ),
});

export const colorTokenSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
});

export const colorTokensSchema = z.array(colorTokenSchema);

// layout
export const radiusSchema = z.number().min(0).max(2);
export const spacingSchema = z.number().min(0.1).max(0.35);

// typography
export const fontsSchema = z.object({
  heading: z.string().min(2),
  body: z.string().min(2),
});
export const letterSpacingSchema = z.number().min(-0.05).max(0.1);

// effects
export const backgroundPatternSchema = z.enum([
  "none",
  ...registryBackgroundPatterns.map((bgPattern) => bgPattern.slug),
]);
export const textureSchema = z.enum([
  "none",
  ...registryTextures.map((texture) => texture.slug),
]);
export const shadowPresetSchema = z.enum(["default"]);
export const shadowsSchema = z.union([
  shadowPresetSchema,
  z.object({
    color: z.string(),
    opacity: z.number().min(0).max(1),
    blurRadius: z.number().min(0).max(100),
    offsetX: z.number().min(0).max(100),
    offsetY: z.number().min(0).max(100),
    spread: z.number().min(0).max(100),
  }),
]);

// theme
export const themeDefinitionSchema = z.object({
  colors: z.object({
    modes: z.array(modeDefinitionSchema).min(1),
    tokens: colorTokensSchema,
  }),
  radius: radiusSchema,
  spacing: spacingSchema,
  fonts: fontsSchema,
  letterSpacing: letterSpacingSchema,
  backgroundPattern: backgroundPatternSchema,
  texture: textureSchema,
  shadows: shadowsSchema,
});

// Variants
export const variantsDefinitionSchema = z.object({
  alert: z.enum(["basic", "notch", "notch-2"]),
  buttons: z.enum(["basic", "brutalist", "outline", "ripple"]),
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
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(2).optional(),
  theme: themeDefinitionSchema,
  icons: iconsDefinitionSchema,
  variants: variantsDefinitionSchema,
});

// ---------------------------------  Minimized definitions  ----------------------------------- //

export const minimizedColorTokensSchema = colorTokensSchema.optional();

export const minimizedColorScaleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  colorKeys: z.array(z.string()).min(1).optional(),
  ratios: z.array(z.number().min(0)).optional(),
  overrides: z.record(z.string(), z.string()).optional(),
});

export const minimizedModeDefinitionSchema = z.object({
  mode: modeSchema,
  lightness: z.number().min(0).max(100).optional(),
  saturation: z.number().min(0).max(100).optional(),
  contrast: z.number().min(0).max(500).optional(),
  scales: z.array(minimizedColorScaleSchema).optional(),
});

export const minimizedThemeDefinitionSchema = z.object({
  colors: z.object({
    modes: z.array(minimizedModeDefinitionSchema),
    tokens: colorTokensSchema.optional(),
  }),
  radius: radiusSchema.optional(),
  spacing: spacingSchema.optional(),
  fonts: fontsSchema.partial().optional(),
  letterSpacing: letterSpacingSchema.optional(),
  backgroundPattern: backgroundPatternSchema.optional(),
  texture: textureSchema.optional(),
  shadows: shadowsSchema.optional(),
});

export const minimizedVariantsDefinitionSchema =
  variantsDefinitionSchema.partial();

export const minimizedIconsDefinitionSchema = iconsDefinitionSchema
  .partial()
  .optional();

export const minimizedStyleDefinitionSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(2).optional().nullable(),
  theme: minimizedThemeDefinitionSchema,
  icons: minimizedIconsDefinitionSchema.optional().nullable(),
  variants: minimizedVariantsDefinitionSchema.optional().nullable(),
});

// ---------------------------------  Processed  ----------------------------------- //

export const CssSchema = z.record(
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
  css: CssSchema.optional(),
  cssVars: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string()).optional(),
    theme: z.record(z.string(), z.string()),
  }),
});

export const variantsSchema = z.object({
  // components
  alert: z.enum(["basic", "notch", "notch-2"]),
  avatar: z.enum(["basic"]),
  badge: z.enum(["basic"]),
  breadcrumbs: z.enum(["basic"]),
  button: z.enum(["basic", "outline", "brutalist", "ripple"]),
  "button-group": z.enum(["basic"]),
  calendar: z.enum(["basic", "cal"]),
  checkbox: z.enum(["basic"]),
  "checkbox-group": z.enum(["basic"]),
  "color-area": z.enum(["basic"]),
  "color-field": z.enum(["basic"]),
  "color-picker": z.enum(["basic"]),
  "color-slider": z.enum(["basic"]),
  "color-swatch": z.enum(["basic"]),
  "color-swatch-picker": z.enum(["basic"]),
  "color-thumb": z.enum(["basic"]),
  combobox: z.enum(["basic"]),
  command: z.enum(["basic"]),
  "date-field": z.enum(["basic"]),
  "date-input": z.enum(["basic"]),
  "date-picker": z.enum(["basic"]),
  "date-range-picker": z.enum(["basic"]),
  dialog: z.enum(["basic"]),
  drawer: z.enum(["basic"]),
  "drop-zone": z.enum(["basic"]),
  field: z.enum(["basic"]),
  "file-trigger": z.enum(["basic"]),
  form: z.enum(["basic", "react-hook-form"]),
  input: z.enum(["basic"]),
  kbd: z.enum(["basic"]),
  "list-box": z.enum(["basic"]),
  loader: z.enum(["dots", "line", "ring", "tailspin", "wave"]),
  menu: z.enum(["basic"]),
  modal: z.enum(["basic", "blur"]),
  "number-field": z.enum(["basic"]),
  overlay: z.enum(["basic"]),
  popover: z.enum(["basic"]),
  "progress-bar": z.enum(["basic"]),
  "radio-group": z.enum(["basic"]),
  ripple: z.enum(["basic"]),
  "search-field": z.enum(["basic"]),
  select: z.enum(["basic"]),
  separator: z.enum(["basic"]),
  skeleton: z.enum(["basic"]),
  slider: z.enum(["basic"]),
  switch: z.enum(["basic"]),
  table: z.enum(["basic"]),
  tabs: z.enum(["basic", "motion"]),
  "tag-group": z.enum(["basic"]),
  text: z.enum(["basic"]),
  "text-area": z.enum(["basic"]),
  "text-field": z.enum(["basic"]),
  "time-field": z.enum(["basic"]),
  "toggle-button": z.enum(["basic"]),
  "toggle-button-group": z.enum(["basic"]),
  tooltip: z.enum(["basic", "motion"]),

  // lib
  "focus-style": z.enum(["basic"]),
});

export const styleSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(2).optional(),
  theme: themeSchema, // used in {styleName}/theme
  icons: iconsDefinitionSchema, // used in {styleName}/base and {styleName}/{componentName}
  variants: variantsSchema, // used in {styleName}/{componentName}
});
