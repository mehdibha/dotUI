import {
  convertColorValue,
  contrast as getContrast,
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import type { CssColor } from "@adobe/leonardo-contrast-colors";

import { RADIUS_TOKENS } from "@dotui/registry-definition/registry-tokens";

import { SCALE_NUMBERRS } from "../constants";
import type { ColorTokens, ModeDefinition, Radius, Theme } from "../types";
import Color from "colorjs.io";

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
  return ratios.reduce(
    (acc, ratio, index) => {
      const scaleName = SCALE_NUMBERRS[index] ?? (index + 1) * 100;
      acc[`${scaleId}-${scaleName}`] = ratio;
      return acc;
    },
    {} as Record<string, number>,
  );
};

export const createColorScales = (modeDefinition: ModeDefinition) => {
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

export const getContrastColor = (colorValue: string): string => {
  const colorTuple = convertColorValue(colorValue, "RGB", true) as unknown as {
    r: number;
    g: number;
    b: number;
  };

  const rgbArray: [number, number, number] = [
    colorTuple.r,
    colorTuple.g,
    colorTuple.b,
  ];

  const contrastWithBlack = getContrast(rgbArray, [0, 0, 0]);
  const contrastWithWhite = getContrast(rgbArray, [255, 255, 255]);

  return contrastWithBlack > contrastWithWhite
    ? "oklch(0% 0 0)"
    : "oklch(100% 0 0)";
};

export const createModeCssVars = (
  modeDefinition: ModeDefinition,
  generateContrastColors = true,
): Record<string, string> => {
  const colorScales = createColorScales(modeDefinition);

  const cssVars = colorScales
    .flatMap((colorScale) =>
      colorScale.values.flatMap((value) =>
        [
          [
            value.name,
            (() => {
              try {
                return new Color(value.value).to("oklch").toString();
              } catch (_e) {
                // Fallback to original if conversion fails
                return value.value;
              }
            })(),
          ] as const,
          generateContrastColors
            ? ([
                `on-${value.name}`,
                // getContrastColor already returns OKLCH
                getContrastColor(value.value),
              ] as const)
            : [],
        ].filter(Boolean),
      ),
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
