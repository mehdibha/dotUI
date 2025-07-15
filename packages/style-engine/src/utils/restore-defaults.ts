import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";

import {
  DEFAULT_DARK_MODE,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_ICON_STROKE_WIDTH,
  DEFAULT_LIGHT_MODE,
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
    id: minimizedScale.id,
    name: minimizedScale.name ?? defaultScale.name,
    colorKeys,
    ratios: minimizedScale.ratios ?? defaultScale.ratios,
    overrides: minimizedScale.overrides ?? defaultScale.overrides,
  };
};

const restoreModeDefinitionDefaults = (
  minimizedMode: MinimizedModeDefinition,
): ModeDefinition => {
  const defaultMode =
    minimizedMode.mode === "light" ? DEFAULT_LIGHT_MODE : DEFAULT_DARK_MODE;

  const scales = defaultMode.scales.map((defaultScale) => {
    const minimizedScale = minimizedMode.scales?.find(
      (scale) => scale.id === defaultScale.id,
    );
    return minimizedScale
      ? restoreColorScaleDefaults(minimizedScale, defaultScale)
      : defaultScale;
  });

  if (minimizedMode.scales) {
    const additionalScales = minimizedMode.scales.filter(
      (scale) =>
        !defaultMode.scales.some(
          (defaultScale) => defaultScale.id === scale.id,
        ),
    );

    additionalScales.forEach((additionalScale) => {
      scales.push(additionalScale as unknown as ColorScale);
    });
  }

  return {
    mode: minimizedMode.mode,
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
      modes: minimizedTheme.colors.modes.map((mode) =>
        restoreModeDefinitionDefaults(mode),
      ),
      tokens: minimizedTheme.colors.tokens ?? [],
    },
    fonts: {
      heading: minimizedTheme.fonts?.heading ?? "Inter",
      body: minimizedTheme.fonts?.body ?? "Inter",
    },
    spacing: minimizedTheme.spacing ?? 1,
    shadows: minimizedTheme.shadows ?? "default",
    radius: minimizedTheme.radius ?? 1,
    texture: minimizedTheme.texture ?? "none",
    backgroundPattern: minimizedTheme.backgroundPattern ?? "none",
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

const restoreStyleDefinitionDefaults = ({
  theme,
  variants,
  icons,
  ...props
}: MinimizedStyleDefinition): StyleDefinition => {
  return {
    ...props,
    description: props.description ?? undefined,
    theme: restoreThemeDefinitionDefaults(theme),
    variants: restoreVariantsDefinitionDefaults(variants ?? {}),
    icons: {
      library: icons?.library ?? DEFAULT_ICON_LIBRARY,
      strokeWidth: icons?.strokeWidth ?? DEFAULT_ICON_STROKE_WIDTH,
    },
  };
};

export {
  restoreColorScaleDefaults,
  restoreModeDefinitionDefaults,
  restoreTokensDefaults,
  restoreThemeDefinitionDefaults,
  restoreVariantsDefinitionDefaults,
  restoreStyleDefinitionDefaults,
};
