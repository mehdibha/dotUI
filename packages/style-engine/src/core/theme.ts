import merge from "deepmerge";

import {
  createColorThemeVars,
  createModeCssVars,
  createRadiusVars,
} from "./colors";
import {
  createBackgroundPatternCss,
  createFontsThemeVars,
  createLetterSpacingThemeVars,
  createShadowsThemeVars,
  createSpacingThemeVars,
  createTextureCss,
} from "./css";
import type { Theme, ThemeDefinition } from "../types";

export const createTheme = (themeDefinition: ThemeDefinition): Theme => {
  const {
    colors,
    radius,
    spacing,
    fonts,
    letterSpacing,
    backgroundPattern,
    shadows,
    texture,
  } = themeDefinition;

  const textureCss = createTextureCss(texture);
  const backgroundPatternCss = createBackgroundPatternCss(backgroundPattern);
  const letterSpacingCss = createLetterSpacingThemeVars(letterSpacing);
  const spacingThemeVars = createSpacingThemeVars(spacing);
  const fontsThemeVars = createFontsThemeVars(fonts);
  const shadowsThemeVars = createShadowsThemeVars(shadows);

  const {
    cssVars: { light: radiusLightVars, theme: radiusThemeVars },
  } = createRadiusVars(radius);

  const lightMode = colors.modes.light;
  const darkMode = colors.modes.dark;
  const activeModes = colors.activeModes;

  const supportsLightAndDark =
    activeModes.includes("light") && activeModes.includes("dark");

  const lightCssVars = supportsLightAndDark
    ? createModeCssVars(lightMode)
    : activeModes.includes("light")
      ? createModeCssVars(lightMode)
      : createModeCssVars(darkMode);
  const darkCssVars = supportsLightAndDark ? createModeCssVars(darkMode) : {};

  const colorThemeVars = createColorThemeVars(colors.tokens);

  return {
    css: merge(letterSpacingCss, textureCss, backgroundPatternCss),
    cssVars: {
      light: { ...radiusLightVars, ...lightCssVars },
      dark: { ...darkCssVars },
      theme: {
        ...colorThemeVars,
        ...radiusThemeVars,
        ...spacingThemeVars,
        ...fontsThemeVars,
        ...shadowsThemeVars,
      },
    },
  };
};
