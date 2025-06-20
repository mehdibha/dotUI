import { z } from "zod";

export const ColorScaleSchema = z.object({
  baseColors: z.array(z.string()).min(1, "At least one base color is required"),
  contrastRatios: z.array(z.number().positive()).optional(),
});

export const ColorPaletteSchema = z.object({
  neutral: ColorScaleSchema,
  accent: ColorScaleSchema,
  success: ColorScaleSchema,
  warning: ColorScaleSchema,
  danger: ColorScaleSchema,
  info: ColorScaleSchema,
});

export const ColorModeSchema = z.object({
  lightness: z.number().min(0).max(100),
  saturation: z.number().min(0).max(100),
  palette: ColorPaletteSchema,
});

export const ThemeDefinitionSchema = z.object({
  borderRadius: z.number().positive().optional(),
  lightMode: ColorModeSchema.optional(),
  darkMode: ColorModeSchema.optional(),
  semanticTokens: z.record(z.string()).optional(),
  customProperties: z
    .record(
      z.union([
        z.string(),
        z.record(z.union([z.string(), z.record(z.string())])),
      ]),
    )
    .optional(),
});

export const TypographyScaleSchema = z.object({
  headingFont: z.string().min(1, "Heading font is required"),
  bodyFont: z.string().min(1, "Body font is required"),
});

export const StyleDefinitionSchema = z.object({
  typography: TypographyScaleSchema,
  theme: ThemeDefinitionSchema,
  registryVariants: z.record(z.string()),
  designTokens: z.record(z.string()),
  iconLibrary: z.string().optional(),
});

export const ComputedThemeSchema = z.object({
  light: z.record(z.string()),
  dark: z.record(z.string()),
  theme: z.record(z.string()),
  css: z.record(
    z.union([
      z.string(),
      z.record(z.union([z.string(), z.record(z.string())])),
    ]),
  ),
});

export const ComputedStyleSchema = z.object({
  name: z.string().min(1, "Style name is required"),
  label: z.string().min(1, "Style label is required"),
  icon: z.string().optional(),
  theme: ComputedThemeSchema,
  typography: TypographyScaleSchema,
  registryVariants: z.record(z.string()),
  designTokens: z.record(z.string()),
  iconLibrary: z.string().optional(),
});

export const CreateStyleRequestSchema = z.object({
  name: z.string().min(1).max(256),
  label: z.string().min(1).max(256),
  description: z.string().optional(),
  definition: StyleDefinitionSchema,
});
