import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import type { CssColor } from "@adobe/leonardo-contrast-colors";

import { RADIUS_TOKENS } from "@dotui/registry-definition/registry-tokens";

import type { ColorTokens, ModeDefinition, Radius, Theme } from "../types";

export interface ColorScale {
  name: string;
  values: {
    name: string;
    contrast: number;
    value: string;
  }[];
}

export const createRatiosObject = (
  scaleId: string,
  ratios: number[],
): Record<string, number> => {
  const scaleNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  return ratios.reduce(
    (acc, ratio, index) => {
      const scaleName = scaleNumbers[index] ?? (index + 1) * 100;
      acc[`${scaleId}-${scaleName}`] = ratio;
      return acc;
    },
    {} as Record<string, number>,
  );
};

export const createColorScales = (
  modeDefinition: ModeDefinition,
): ColorScale[] => {
  const neutralScale = modeDefinition.scales.neutral;

  const neutral = new LeonardoBgColor({
    name: "neutral",
    colorKeys: neutralScale.colorKeys.map((color) => color.color) as CssColor[],
    ratios: createRatiosObject("neutral", neutralScale.ratios),
  });

  const colors = Object.entries(modeDefinition.scales).map(
    ([scaleId, scale]) => {
      const color = new LeonardoColor({
        name: scaleId,
        colorKeys: scale.colorKeys.map((color) => color.color) as CssColor[],
        ratios: createRatiosObject(scaleId, scale.ratios),
        smooth: scale.smooth,
      });
      return color;
    },
  );

  const generatedTheme = new LeonardoTheme({
    colors,
    backgroundColor: neutral,
    lightness: modeDefinition.lightness,
    saturation: modeDefinition.saturation,
    contrast: modeDefinition.contrast / 100,
    output: "HEX",
  });

  const [_, ...scales] = generatedTheme.contrastColors;

  return scales;
};

export const createModeCssVars = (
  modeDefinition: ModeDefinition,
): Record<string, string> => {
  const colorScales = createColorScales(modeDefinition);

  const cssVars = colorScales
    .flatMap((colorScale) =>
      colorScale.values.map((value) => [value.name, value.value] as const),
    )
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
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
