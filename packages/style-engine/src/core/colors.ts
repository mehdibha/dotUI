import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import type { CssColor } from "@adobe/leonardo-contrast-colors";

import { RADIUS_TOKENS } from "@dotui/registry-definition/registry-tokens";

import type { ColorTokens, ModeDefinition, Radius, Theme } from "../types";

export const createModeCssVars = (
  modeDefinition: ModeDefinition,
): Record<string, string> => {
  const neutralScale = modeDefinition.scales.find(
    (scale) => scale.id === "neutral",
  );
  if (!neutralScale) {
    throw new Error("Neutral scale is required");
  }

  const neutral = new LeonardoBgColor({
    name: "neutral",
    colorKeys: neutralScale.colorKeys.map((color) => color.color) as CssColor[],
    ratios: [...neutralScale.ratios],
  });

  const colors = modeDefinition.scales.map((scale) => {
    const props = {
      name: scale.id,
      colorKeys: scale.colorKeys.map((color) => color.color) as CssColor[],
      ratios: [...scale.ratios],
    };
    const color = new LeonardoColor(props);
    return color;
  });

  const generatedTheme = new LeonardoTheme({
    colors,
    backgroundColor: neutral,
    lightness: modeDefinition.lightness,
    saturation: modeDefinition.saturation,
    contrast: modeDefinition.contrast / 100,
    output: "HEX",
  });

  const cssVars = generatedTheme.contrastColors
    .map((color) => {
      if ("name" in color) {
        return color.values.map((item, index) => {
          const scale = (index + 1) * 100;
          const entries: [string, string][] = [
            [`${color.name}-${scale}`, item.value],
          ];
          return entries;
        });
      }
      return undefined;
    })
    .filter((color): color is NonNullable<typeof color> => Boolean(color))
    .flatMap((color) => color)
    .reduce(
      (acc, curr) => {
        const result: Record<string, string> = {};
        curr.forEach(([key, value]) => {
          result[key] = value;
        });
        return { ...acc, ...result };
      },
      {} as Record<string, string>,
    );

  return cssVars;
};

export const createColorThemeVars = (
  tokensDefinition: ColorTokens,
): Record<string, string> => {
  const cssThemeVars = tokensDefinition.reduce(
    (acc, token) => {
      acc[token.name] = token.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return cssThemeVars;
};

export const createRadiusVars = (radius: Radius): Theme => {
  const themeCssVars = RADIUS_TOKENS.reduce(
    (acc, token) => {
      acc[token.name] = token.defaultValue;
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    cssVars: {
      light: {
        "radius-factor": radius.toString(),
      },
      theme: {
        ...themeCssVars,
      },
    },
  };
};
