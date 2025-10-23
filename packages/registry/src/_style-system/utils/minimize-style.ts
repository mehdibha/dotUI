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

const _minimizeColorScale = (scale: ColorScale): MinimizedColorScale => {
  return scale;
};

const minimizeModeDefinition = (
  mode: ModeDefinition,
): MinimizedModeDefinition => {
  return mode;
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
    theme: minimizeThemeDefinition(style.theme),
    variants: minimizeVariantsDefinition(style.variants),
    icons: minimizeIconsDefinition(style.icons),
  };

  return minimized;
};
