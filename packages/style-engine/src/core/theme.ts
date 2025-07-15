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

  const lightMode = colors.modes.find((mode) => mode.mode === "light");
  const darkMode = colors.modes.find((mode) => mode.mode === "dark");

  const supportsLightAndDark = lightMode && darkMode;

  if (!(colors.modes.length > 0)) {
    throw new Error("At least one mode is required");
  }

  const lightCssVars = supportsLightAndDark
    ? createModeCssVars(lightMode)
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      createModeCssVars(colors.modes[0]!);
  const darkCssVars = supportsLightAndDark ? createModeCssVars(darkMode) : {};

  const colorThemeVars = createColorThemeVars(colors.tokens);

  return {
    css: merge(letterSpacingCss, textureCss, backgroundPatternCss),
    cssVars: {
      light: { ...lightCssVars, ...radiusLightVars },
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
