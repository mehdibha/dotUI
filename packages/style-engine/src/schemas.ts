import { z } from "zod/v4";

import type { Fonts, StyleDefinition, Variants } from "./types";
import {
  DEFAULT_FONTS,
  DEFAULT_STYLE_DEFINITION,
  DEFAULT_VARIANTS,
} from "./constants/defaults";

export const iconLibrarySchema = z.enum(["lucide", "remix-icons"]);

export const fontsSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
});

export const variantsSchema = z
  .object({
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
  })
  .passthrough();

export const styleDefinitionSchema = z.object({
  iconLibrary: iconLibrarySchema,
  fonts: fontsSchema,
  variants: variantsSchema,
});

// Re-export defaults for convenience
export { DEFAULT_FONTS as defaultFonts };
export { DEFAULT_VARIANTS as defaultVariants };
export { DEFAULT_STYLE_DEFINITION as defaultStyleDefinition };

// Re-export utility functions
export {
  mergeWithDefaults,
  getDifferencesFromDefaults,
} from "./constants/defaults";
