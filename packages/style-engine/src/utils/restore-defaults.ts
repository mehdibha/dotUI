import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";

import {
  DEFAULT_ACCENT_LEVEL,
  DEFAULT_BACKGROUND_PATTERN,
  DEFAULT_DARK_MODE,
  DEFAULT_FONTS,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_ICON_STROKE_WIDTH,
  DEFAULT_LIGHT_MODE,
  DEFAULT_RADIUS_FACTOR,
  DEFAULT_SHADOWS,
  DEFAULT_SPACING,
  DEFAULT_TEXTURE,
  DEFAULT_VARIANTS_DEFINITION,
} from "../constants";
import type {
  ColorScale,
  ColorTokens,
  MinimizedColorScale,
  MinimizedColorTokens,
  MinimizedModeDefinition,
  MinimizedStyleDefinition,
  MinimizedThemeDefinition,
  MinimizedVariantsDefinition,
  ModeDefinition,
  StyleDefinition,
  ThemeDefinition,
  VariantsDefinition,
} from "../types";

const restoreColorScaleDefaults = (
  minimizedScale: MinimizedColorScale,
  defaultScale: ColorScale,
): ColorScale => {
  const colorKeys = minimizedScale.colorKeys
    ? minimizedScale.colorKeys.map((color, index) => ({ id: index, color }))
    : defaultScale.colorKeys;

  return {
    name: minimizedScale.name ?? defaultScale.name,
    colorKeys,
    ratios: minimizedScale.ratios ?? defaultScale.ratios,
    smooth: minimizedScale.smooth ?? false,
    overrides: minimizedScale.overrides ?? defaultScale.overrides,
  };
};

const restoreModeDefinitionDefaults = (
  minimizedMode: MinimizedModeDefinition,
  isLight: boolean,
): ModeDefinition => {
  const defaultMode = isLight ? DEFAULT_LIGHT_MODE : DEFAULT_DARK_MODE;

  const scales = { ...defaultMode.scales };

  if (minimizedMode.scales) {
    Object.entries(minimizedMode.scales).forEach(
      ([scaleId, minimizedScale]) => {
        const defaultScale = defaultMode.scales[scaleId];
        if (defaultScale) {
          scales[scaleId as keyof typeof scales] = restoreColorScaleDefaults(
            minimizedScale,
            defaultScale,
          );
        }
      },
    );
  }

  return {
    lightness: minimizedMode.lightness ?? defaultMode.lightness,
    saturation: minimizedMode.saturation ?? defaultMode.saturation,
    contrast: minimizedMode.contrast ?? defaultMode.contrast,
    scales,
  };
};

const restoreTokensDefaults = (
  minimizedTokens: MinimizedColorTokens,
): ColorTokens => {
  const defaultTokens: ColorTokens = COLOR_TOKENS.map((token) => ({
    id: token.name,
    name: token.name,
    value: token.defaultValue,
  }));

  if (!minimizedTokens) {
    return defaultTokens;
  }

  const existingTokenIds = new Set(minimizedTokens.map((token) => token.id));
  const missingTokens = defaultTokens.filter(
    (defaultToken) => !existingTokenIds.has(defaultToken.id),
  );

  return [...minimizedTokens, ...missingTokens];
};

const restoreThemeDefinitionDefaults = (
  minimizedTheme: MinimizedThemeDefinition,
): ThemeDefinition => {
  return {
    colors: {
      activeModes: minimizedTheme.colors.activeModes ?? ["light", "dark"],
      modes: {
        light: restoreModeDefinitionDefaults(
          minimizedTheme.colors.modes?.light ?? {},
          true,
        ),
        dark: restoreModeDefinitionDefaults(
          minimizedTheme.colors.modes?.dark ?? {},
          false,
        ),
      },
      accentLevel:
        minimizedTheme.colors.accentLevel ?? DEFAULT_ACCENT_LEVEL,
      tokens: restoreTokensDefaults(minimizedTheme.colors.tokens ?? []),
    },
    fonts: {
      heading: minimizedTheme.fonts?.heading ?? DEFAULT_FONTS.heading,
      body: minimizedTheme.fonts?.body ?? DEFAULT_FONTS.body,
    },
    spacing: minimizedTheme.spacing ?? DEFAULT_SPACING,
    shadows: minimizedTheme.shadows ?? DEFAULT_SHADOWS,
    radius: minimizedTheme.radius ?? DEFAULT_RADIUS_FACTOR,
    texture: minimizedTheme.texture ?? DEFAULT_TEXTURE,
    backgroundPattern:
      minimizedTheme.backgroundPattern ?? DEFAULT_BACKGROUND_PATTERN,
    letterSpacing: minimizedTheme.letterSpacing ?? 0,
  };
};

const restoreVariantsDefinitionDefaults = (
  minimizedVariants: MinimizedVariantsDefinition,
): VariantsDefinition => {
  return {
    ...DEFAULT_VARIANTS_DEFINITION,
    ...minimizedVariants,
  };
};

const restoreStyleDefinitionDefaults = <T extends MinimizedStyleDefinition>({
  theme,
  variants,
  icons,
  ...props
}: T): StyleDefinition & Omit<T, keyof MinimizedStyleDefinition> => {
  return {
    ...props,
    theme: restoreThemeDefinitionDefaults(theme),
    variants: restoreVariantsDefinitionDefaults(variants ?? {}),
    icons: {
      library: icons?.library ?? DEFAULT_ICON_LIBRARY,
      strokeWidth: icons?.strokeWidth ?? DEFAULT_ICON_STROKE_WIDTH,
    },
  } as StyleDefinition & Omit<T, keyof MinimizedStyleDefinition>;
};

export {
  restoreColorScaleDefaults,
  restoreModeDefinitionDefaults,
  restoreTokensDefaults,
  restoreThemeDefinitionDefaults,
  restoreVariantsDefinitionDefaults,
  restoreStyleDefinitionDefaults,
};
