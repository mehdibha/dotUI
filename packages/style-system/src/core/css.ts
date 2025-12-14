import type {
  BackgroundPattern,
  BackgroundPatternRegistryItem,
  Css,
  Fonts,
  LetterSpacing,
  Shadows,
  Spacing,
  Texture,
  TextureRegistryItem,
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

export const createTextureCss = (
  texture: Texture,
  textures?: TextureRegistryItem[],
): Css => {
  if (texture === "none") {
    return {};
  }

  if (!textures) {
    return {};
  }

  const textureData = textures.find((t) => t.slug === texture);
  if (!textureData) {
    return {};
  }

  return textureData.css;
};

export const createBackgroundPatternCss = (
  bgPattern: BackgroundPattern,
  backgroundPatterns?: BackgroundPatternRegistryItem[],
): Css => {
  if (bgPattern === "none") {
    return {};
  }

  if (!backgroundPatterns) {
    return {};
  }

  const bgPatternData = backgroundPatterns.find((b) => b.slug === bgPattern);

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
  return {};
};

export const createSpacingThemeVars = (
  spacing: Spacing,
): Record<string, string> => {
  return {
    spacing: `${spacing}rem`,
  };
};
