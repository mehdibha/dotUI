import { registryBackgroundPatterns } from "../../background-patterns/registry";
import { registryTextures } from "../../textures/registry";
import type {
  BackgroundPattern,
  Css,
  Fonts,
  LetterSpacing,
  Shadows,
  Spacing,
  Texture,
} from "../types";

export const createShadowsThemeVars = (
  shadows: Shadows,
): Record<string, string> => {
  if (typeof shadows === "string") {
    if (shadows === "default") {
      return {};
    }
  }
  return {};
};

export const createTextureCss = (texture: Texture): Css => {
  if (texture === "none") {
    return {};
  }

  const textureData = registryTextures.find((t) => t.slug === texture);
  if (!textureData) {
    return {};
  }

  return textureData.css;
};

export const createBackgroundPatternCss = (
  bgPattern: BackgroundPattern,
): Css => {
  if (bgPattern === "none") {
    return {};
  }

  const bgPatternData = registryBackgroundPatterns.find(
    (b) => b.slug === bgPattern,
  );

  if (!bgPatternData) {
    return {};
  }

  return bgPatternData.css;
};

export const createLetterSpacingThemeVars = (
  letterSpacing: LetterSpacing,
): Css => {
  return { body: { "letter-spacing": `${letterSpacing}em` } };
};

export const createFontsThemeVars = (_fonts: Fonts): Record<string, string> => {
  // const vars: Record<string, string> = {};

  // Object.entries(fonts).forEach(([key, value]) => {
  //   vars[`--font-${key}`] = `var(--font-${value})`;
  // });

  // return vars;
  return {};
};

export const createSpacingThemeVars = (
  spacing: Spacing,
): Record<string, string> => {
  return {
    spacing: `${spacing}em`,
  };
};
