import type {
  ColorScale,
  ColorTokens,
  Fonts,
  IconsDefinition,
  ModeDefinition,
  ScaleId,
  StyleDefinition,
  ThemeDefinition,
  VariantsDefinition,
} from "../types";

// --------------------------------- Default Values --------------------------------- //

export const DEFAULT_RADIUS_FACTOR = 1;
export const DEFAULT_SPACING = 0.25;
export const DEFAULT_LETTER_SPACING = 0;
export const DEFAULT_BACKGROUND_PATTERN = "none";
export const DEFAULT_TEXTURE = "none";
export const DEFAULT_SHADOWS = "default" as const;
export const DEFAULT_ICON_LIBRARY = "lucide";
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

// --------------------------------- Restore Functions --------------------------------- //

/**
 * Restore color scale with defaults
 */
export const restoreColorScaleDefaults = (
  scale: Partial<ColorScale> | undefined,
  defaultScale: ColorScale,
): ColorScale => {
  if (!scale) return defaultScale;
  return {
    name: scale.name ?? defaultScale.name,
    colorKeys: scale.colorKeys ?? defaultScale.colorKeys,
    ratios: scale.ratios ?? defaultScale.ratios,
    smooth: scale.smooth ?? defaultScale.smooth,
    overrides: scale.overrides ?? defaultScale.overrides,
  };
};

/**
 * Restore mode definition with defaults
 */
export const restoreModeDefinitionDefaults = (
  mode: Partial<ModeDefinition> | undefined,
  isLight: boolean,
): ModeDefinition => {
  const defaultMode = isLight ? DEFAULT_LIGHT_MODE : DEFAULT_DARK_MODE;

  if (!mode) return defaultMode;

  const scales = { ...defaultMode.scales };

  if (mode.scales) {
    (Object.keys(mode.scales) as ScaleId[]).forEach((scaleId) => {
      const inputScale = mode.scales?.[scaleId];
      if (inputScale) {
        scales[scaleId] = restoreColorScaleDefaults(
          inputScale,
          defaultMode.scales[scaleId],
        );
      }
    });
  }

  return {
    lightness: mode.lightness ?? defaultMode.lightness,
    saturation: mode.saturation ?? defaultMode.saturation,
    contrast: mode.contrast ?? defaultMode.contrast,
    scales,
  };
};

/**
 * Restore tokens with defaults
 */
export const restoreTokensDefaults = (
  tokens: ColorTokens | undefined,
  defaultTokens: ColorTokens,
): ColorTokens => {
  if (!tokens) return defaultTokens;
  return { ...defaultTokens, ...tokens };
};

/**
 * Restore theme definition with defaults
 */
export const restoreThemeDefinitionDefaults = (
  theme: Partial<ThemeDefinition> & {
    colors: Partial<ThemeDefinition["colors"]>;
  },
  defaultTokens?: ColorTokens,
): ThemeDefinition => {
  return {
    colors: {
      activeModes: theme.colors?.activeModes ?? ["light", "dark"],
      modes: {
        light: restoreModeDefinitionDefaults(theme.colors?.modes?.light, true),
        dark: restoreModeDefinitionDefaults(theme.colors?.modes?.dark, false),
      },
      tokens: restoreTokensDefaults(theme.colors?.tokens, defaultTokens ?? {}),
      accentEmphasisLevel:
        theme.colors?.accentEmphasisLevel ?? DEFAULT_ACCENT_EMPHASIS_LEVEL,
    },
    fonts: {
      heading: theme.fonts?.heading ?? DEFAULT_FONTS.heading,
      body: theme.fonts?.body ?? DEFAULT_FONTS.body,
    },
    spacing: theme.spacing ?? DEFAULT_SPACING,
    shadows: theme.shadows ?? DEFAULT_SHADOWS,
    radius: theme.radius ?? DEFAULT_RADIUS_FACTOR,
    texture: theme.texture ?? DEFAULT_TEXTURE,
    backgroundPattern: theme.backgroundPattern ?? DEFAULT_BACKGROUND_PATTERN,
    letterSpacing: theme.letterSpacing ?? DEFAULT_LETTER_SPACING,
  };
};

/**
 * Restore variants definition with defaults
 */
export const restoreVariantsDefinitionDefaults = (
  variants: Partial<VariantsDefinition> | undefined,
): VariantsDefinition => {
  return {
    ...DEFAULT_VARIANTS_DEFINITION,
    ...variants,
  };
};

/**
 * Restore icons definition with defaults
 */
export const restoreIconsDefinitionDefaults = (
  icons: Partial<IconsDefinition> | undefined,
): IconsDefinition => {
  return {
    library: icons?.library ?? DEFAULT_ICON_LIBRARY,
    strokeWidth: icons?.strokeWidth ?? DEFAULT_ICON_STROKE_WIDTH,
  };
};

/**
 * Restore full style definition with defaults
 */
export const restoreStyleDefinitionDefaults = <
  T extends {
    theme: Partial<ThemeDefinition> & {
      colors: Partial<ThemeDefinition["colors"]>;
    };
    icons?: Partial<IconsDefinition>;
    variants?: Partial<VariantsDefinition>;
  },
>(
  input: T,
  defaultTokens?: ColorTokens,
): StyleDefinition & Omit<T, "theme" | "icons" | "variants"> => {
  const { theme, variants, icons, ...rest } = input;

  return {
    ...rest,
    theme: restoreThemeDefinitionDefaults(theme, defaultTokens),
    variants: restoreVariantsDefinitionDefaults(variants),
    icons: restoreIconsDefinitionDefaults(icons),
  } as StyleDefinition & Omit<T, "theme" | "icons" | "variants">;
};
