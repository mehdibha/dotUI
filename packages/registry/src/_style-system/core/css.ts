import { registryBackgroundPatterns } from "../../background-patterns/registry";
// import { registryShadows } from "@dotui/registry-definition/registry-shadows";
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shadows === "default") {
      return {};
    }
  }
  return {};
  // const { color, opacity, blurRadius, offsetX, offsetY, spread } = shadows;

  // return {
  //   "shadow-2xs": "0 1px rgb(0 0 0 / 0.05)",
  //   "shadow-xs": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  //   "shadow-sm":
  //     "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  //   "shadow-md":
  //     "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  //   "shadow-lg":
  //     "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  //   "shadow-xl":
  //     "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  //   "shadow-2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  // };
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
