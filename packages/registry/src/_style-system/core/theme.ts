import merge from "deepmerge";

import type { ColorFormat, Theme, ThemeDefinition } from "../types";
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

export const createTheme = (
  themeDefinition: ThemeDefinition,
  generateContrastColors = true,
  colorFormat: ColorFormat = "oklch",
): Theme => {
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
    ? createModeCssVars(lightMode, generateContrastColors, colorFormat)
    : activeModes.includes("light")
      ? createModeCssVars(lightMode, generateContrastColors, colorFormat)
      : createModeCssVars(darkMode, generateContrastColors, colorFormat);
  const darkCssVars = supportsLightAndDark
    ? createModeCssVars(darkMode, generateContrastColors, colorFormat)
    : {};

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
