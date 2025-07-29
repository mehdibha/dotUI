// TODO: wip, we need to minimize the style by removing the defaults
import type {
  ColorScale,
  IconsDefinition,
  MinimizedColorScale,
  MinimizedIconsDefinition,
  MinimizedModeDefinition,
  MinimizedStyleDefinition,
  MinimizedThemeDefinition,
  MinimizedVariantsDefinition,
  ModeDefinition,
  StyleDefinition,
  ThemeDefinition,
  VariantsDefinition,
} from "../types";

const minimizeColorScale = (scale: ColorScale): MinimizedColorScale => {
  return {
    ...scale,
    colorKeys: scale.colorKeys.map((key) => key.color),
  };
};

const minimizeModeDefinition = (
  mode: ModeDefinition,
): MinimizedModeDefinition => {
  return {
    ...mode,
    scales: {
      neutral: minimizeColorScale(mode.scales.neutral),
      accent: minimizeColorScale(mode.scales.accent),
      success: minimizeColorScale(mode.scales.success),
      warning: minimizeColorScale(mode.scales.warning),
      danger: minimizeColorScale(mode.scales.danger),
      info: minimizeColorScale(mode.scales.info),
    },
  };
};

const minimizeThemeDefinition = (
  theme: ThemeDefinition,
): MinimizedThemeDefinition => {
  return {
    ...theme,
    colors: {
      activeModes: theme.colors.activeModes,
      modes: {
        light: minimizeModeDefinition(theme.colors.modes.light),
        dark: minimizeModeDefinition(theme.colors.modes.dark),
      },
      tokens: theme.colors.tokens,
    },
  };
};

const minimizeVariantsDefinition = (
  variants: VariantsDefinition,
): MinimizedVariantsDefinition => {
  return variants;
};

const minimizeIconsDefinition = (
  icons: IconsDefinition,
): MinimizedIconsDefinition => {
  return icons;
};

export const minimizeStyleDefinition = (
  style: StyleDefinition,
): MinimizedStyleDefinition => {
  const minimized: MinimizedStyleDefinition = {
    name: style.name,
    description: style.description,
    theme: minimizeThemeDefinition(style.theme),
    variants: minimizeVariantsDefinition(style.variants),
    icons: minimizeIconsDefinition(style.icons),
  };

  return minimized;
};
