import { z } from "zod";

import { registryBackgroundPatterns } from "@dotui/registry/background-patterns/registry";
import { iconLibraries } from "@dotui/registry/icons/registry";
import { focusStylesVariants } from "@dotui/registry/lib/focus-styles/meta";
import { registryTextures } from "@dotui/registry/textures/registry";
import { accordionVariants } from "@dotui/registry/ui/accordion/meta";
import { alertVariants } from "@dotui/registry/ui/alert/meta";
import { avatarVariants } from "@dotui/registry/ui/avatar/meta";
import { badgeVariants } from "@dotui/registry/ui/badge/meta";
import { breadcrumbsVariants } from "@dotui/registry/ui/breadcrumbs/meta";
import { buttonVariants } from "@dotui/registry/ui/button/meta";
import { calendarVariants } from "@dotui/registry/ui/calendar/meta";
import { cardVariants } from "@dotui/registry/ui/card/meta";
import { checkboxVariants } from "@dotui/registry/ui/checkbox/meta";
import { checkboxGroupVariants } from "@dotui/registry/ui/checkbox-group/meta";
import { colorAreaVariants } from "@dotui/registry/ui/color-area/meta";
import { colorEditorVariants } from "@dotui/registry/ui/color-editor/meta";
import { colorFieldVariants } from "@dotui/registry/ui/color-field/meta";
import { colorPickerVariants } from "@dotui/registry/ui/color-picker/meta";
import { colorSliderVariants } from "@dotui/registry/ui/color-slider/meta";
import { colorSwatchVariants } from "@dotui/registry/ui/color-swatch/meta";
import { colorSwatchPickerVariants } from "@dotui/registry/ui/color-swatch-picker/meta";
import { colorThumbVariants } from "@dotui/registry/ui/color-thumb/meta";
import { comboboxVariants } from "@dotui/registry/ui/combobox/meta";
import { commandVariants } from "@dotui/registry/ui/command/meta";
import { dateFieldVariants } from "@dotui/registry/ui/date-field/meta";
import { datePickerVariants } from "@dotui/registry/ui/date-picker/meta";
import { dialogVariants } from "@dotui/registry/ui/dialog/meta";
import { drawerVariants } from "@dotui/registry/ui/drawer/meta";
import { dropZoneVariants } from "@dotui/registry/ui/drop-zone/meta";
import { emptyVariants } from "@dotui/registry/ui/empty/meta";
import { fieldVariants } from "@dotui/registry/ui/field/meta";
import { fileTriggerVariants } from "@dotui/registry/ui/file-trigger/meta";
import { formVariants } from "@dotui/registry/ui/form/meta";
import { groupVariants } from "@dotui/registry/ui/group/meta";
import { inputVariants } from "@dotui/registry/ui/input/meta";
import { kbdVariants } from "@dotui/registry/ui/kbd/meta";
import { linkVariants } from "@dotui/registry/ui/link/meta";
import { listBoxVariants } from "@dotui/registry/ui/list-box/meta";
import { loaderVariants } from "@dotui/registry/ui/loader/meta";
import { menuVariants } from "@dotui/registry/ui/menu/meta";
import { modalVariants } from "@dotui/registry/ui/modal/meta";
import { numberFieldVariants } from "@dotui/registry/ui/number-field/meta";
import { overlayVariants } from "@dotui/registry/ui/overlay/meta";
import { popoverVariants } from "@dotui/registry/ui/popover/meta";
import { progressBarVariants } from "@dotui/registry/ui/progress-bar/meta";
import { radioGroupVariants } from "@dotui/registry/ui/radio-group/meta";
import { searchFieldVariants } from "@dotui/registry/ui/search-field/meta";
import { selectVariants } from "@dotui/registry/ui/select/meta";
import { separatorVariants } from "@dotui/registry/ui/separator/meta";
import { skeletonVariants } from "@dotui/registry/ui/skeleton/meta";
import { sliderVariants } from "@dotui/registry/ui/slider/meta";
import { switchVariants } from "@dotui/registry/ui/switch/meta";
import { tableVariants } from "@dotui/registry/ui/table/meta";
import { tabsVariants } from "@dotui/registry/ui/tabs/meta";
import { tagGroupVariants } from "@dotui/registry/ui/tag-group/meta";
import { textVariants } from "@dotui/registry/ui/text/meta";
import { textAreaVariants } from "@dotui/registry/ui/text-area/meta";
import { textFieldVariants } from "@dotui/registry/ui/text-field/meta";
import { timeFieldVariants } from "@dotui/registry/ui/time-field/meta";
import { toastVariants } from "@dotui/registry/ui/toast/meta";
import { toggleButtonVariants } from "@dotui/registry/ui/toggle-button/meta";
import { toggleButtonGroupVariants } from "@dotui/registry/ui/toggle-button-group/meta";
import { tooltipVariants } from "@dotui/registry/ui/tooltip/meta";

// ---------------------------------  Definitions  ----------------------------------- //

// Icons
export const iconLibrarySchema = z.enum(iconLibraries.map((lib) => lib.name));
export const iconsDefinitionSchema = z.object({
  library: iconLibrarySchema,
  strokeWidth: z.number().min(0.5).max(3),
});

// Colors
export const colorScaleSchema = z.object({
  name: z.string().min(1),
  colorKeys: z.array(z.string()).min(1),
  ratios: z.array(z.number().min(0)),
  smooth: z.boolean(),
  overrides: z.record(z.string(), z.string()),
});

export const modeDefinitionSchema = z.object({
  lightness: z.number().min(0).max(100),
  saturation: z.number().min(0).max(100),
  contrast: z.number().min(0).max(500),
  scales: z.object({
    neutral: colorScaleSchema,
    accent: colorScaleSchema,
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

export const colorTokensSchema = z.record(z.string(), colorTokenSchema);

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

export const activeModesSchema = z
  .array(z.enum(["light", "dark"]).and(z.string()))
  .refine((modes) => modes.length > 0, {
    message: "At least one mode must be defined",
  });

// theme
export const themeDefinitionSchema = z.object({
  colors: z.object({
    activeModes: activeModesSchema,
    modes: z.object({
      light: modeDefinitionSchema,
      dark: modeDefinitionSchema,
    }),
    tokens: colorTokensSchema,
    accentEmphasisLevel: z.number().min(0).max(3),
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
  alert: z.enum(alertVariants),
  buttons: z.enum(buttonVariants),
  calendars: z.enum(calendarVariants),
  card: z.enum(cardVariants),
  checkboxes: z.enum(checkboxVariants),
  "focus-style": z.enum(focusStylesVariants),
  inputs: z.enum(inputVariants),
  link: z.enum(linkVariants),
  "list-box-and-menu": z.enum(listBoxVariants),
  loader: z.enum(loaderVariants),
  overlays: z.enum(overlayVariants),
  pickers: z.enum(selectVariants),
  radios: z.enum(radioGroupVariants),
  selection: z.enum(selectVariants),
  skeleton: z.enum(skeletonVariants),
  slider: z.enum(sliderVariants),
  switch: z.enum(switchVariants),
  "badge-and-tag-group": z.enum(badgeVariants),
  tooltip: z.enum(tooltipVariants),
});

export const styleDefinitionSchema = z.object({
  theme: themeDefinitionSchema,
  icons: iconsDefinitionSchema,
  variants: variantsDefinitionSchema,
});

// ---------------------------------  Minimized definitions  ----------------------------------- //

export const minimizedColorTokensSchema = colorTokensSchema.optional();

export const minimizedColorScaleSchema = z.object({
  name: z.string().min(1).optional(),
  colorKeys: z.array(z.string()).min(1).optional(),
  ratios: z.array(z.number().min(0)).optional(),
  smooth: z.boolean().optional(),
  overrides: z.record(z.string(), z.string()).optional(),
});

export const minimizedModeDefinitionSchema = z.object({
  lightness: z.number().min(0).max(100).optional(),
  saturation: z.number().min(0).max(100).optional(),
  contrast: z.number().min(0).max(500).optional(),
  scales: z
    .object({
      neutral: minimizedColorScaleSchema.optional(),
      accent: minimizedColorScaleSchema.optional(),
      success: minimizedColorScaleSchema.optional(),
      warning: minimizedColorScaleSchema.optional(),
      danger: minimizedColorScaleSchema.optional(),
      info: minimizedColorScaleSchema.optional(),
    })
    .and(z.record(z.string(), minimizedColorScaleSchema))
    .optional(),
});

export const minimizedThemeDefinitionSchema = z.object({
  colors: z.object({
    activeModes: activeModesSchema.optional(),
    modes: z
      .object({
        light: minimizedModeDefinitionSchema.optional(),
        dark: minimizedModeDefinitionSchema.optional(),
      })
      .optional(),
    tokens: colorTokensSchema.optional(),
    accentEmphasisLevel: z.number().min(0).max(3).optional(),
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

/**
 * Variants schema built statically from imported variant arrays
 * This approach preserves full type information for perfect TypeScript inference
 *
 * Each UI component from the registry gets its own entry here, enabling
 * proper autocomplete and type safety for all variants
 */
export const variantsSchema = z.object({
  accordion: z.enum(accordionVariants),
  alert: z.enum(alertVariants),
  avatar: z.enum(avatarVariants),
  badge: z.enum(badgeVariants),
  breadcrumbs: z.enum(breadcrumbsVariants),
  button: z.enum(buttonVariants),
  calendar: z.enum(calendarVariants),
  card: z.enum(cardVariants),
  checkbox: z.enum(checkboxVariants),
  "checkbox-group": z.enum(checkboxGroupVariants),
  "color-area": z.enum(colorAreaVariants),
  "color-editor": z.enum(colorEditorVariants),
  "color-field": z.enum(colorFieldVariants),
  "color-picker": z.enum(colorPickerVariants),
  "color-slider": z.enum(colorSliderVariants),
  "color-swatch": z.enum(colorSwatchVariants),
  "color-swatch-picker": z.enum(colorSwatchPickerVariants),
  "color-thumb": z.enum(colorThumbVariants),
  combobox: z.enum(comboboxVariants),
  command: z.enum(commandVariants),
  "date-field": z.enum(dateFieldVariants),
  "date-picker": z.enum(datePickerVariants),
  dialog: z.enum(dialogVariants),
  drawer: z.enum(drawerVariants),
  "drop-zone": z.enum(dropZoneVariants),
  empty: z.enum(emptyVariants),
  field: z.enum(fieldVariants),
  "file-trigger": z.enum(fileTriggerVariants),
  "focus-styles": z.enum(focusStylesVariants),
  form: z.enum(formVariants),
  group: z.enum(groupVariants),
  input: z.enum(inputVariants),
  kbd: z.enum(kbdVariants),
  link: z.enum(linkVariants),
  "list-box": z.enum(listBoxVariants),
  loader: z.enum(loaderVariants),
  menu: z.enum(menuVariants),
  modal: z.enum(modalVariants),
  "number-field": z.enum(numberFieldVariants),
  overlay: z.enum(overlayVariants),
  popover: z.enum(popoverVariants),
  "progress-bar": z.enum(progressBarVariants),
  "radio-group": z.enum(radioGroupVariants),
  "search-field": z.enum(searchFieldVariants),
  select: z.enum(selectVariants),
  separator: z.enum(separatorVariants),
  skeleton: z.enum(skeletonVariants),
  slider: z.enum(sliderVariants),
  switch: z.enum(switchVariants),
  table: z.enum(tableVariants),
  tabs: z.enum(tabsVariants),
  "tag-group": z.enum(tagGroupVariants),
  text: z.enum(textVariants),
  "text-area": z.enum(textAreaVariants),
  "text-field": z.enum(textFieldVariants),
  "time-field": z.enum(timeFieldVariants),
  toast: z.enum(toastVariants),
  "toggle-button": z.enum(toggleButtonVariants),
  "toggle-button-group": z.enum(toggleButtonGroupVariants),
  tooltip: z.enum(tooltipVariants),
});

export const styleSchema = z.object({
  theme: themeSchema,
  icons: iconsDefinitionSchema,
  variants: variantsSchema,
});
