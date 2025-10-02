import {
  convertColorValue,
  contrast as getContrast,
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import type { CssColor } from "@adobe/leonardo-contrast-colors";
import type { Color } from "react-aria-components";

import { RADIUS_TOKENS } from "../../tokens/registry";
import { SCALE_STEPS } from "../constants";
import type {
  ColorScale,
  ColorTokens,
  ModeDefinition,
  Radius,
  Theme,
} from "../types";

export const toColorString = (colorValue: string | Color): CssColor => {
  if (typeof colorValue === "string") {
    return colorValue as CssColor;
  }
  return colorValue.toString("hex") as CssColor;
};

export const createRatiosObject = (
  scaleId: string,
  ratios: number[],
): Record<string, number> => {
  return ratios.reduce(
    (acc, ratio, index) => {
      const scaleName = SCALE_STEPS[index] ?? (index + 1) * 100;
      acc[`${scaleId}-${scaleName}`] = ratio;
      return acc;
    },
    {} as Record<string, number>,
  );
};

export const createColorScales = ({
  lightness,
  saturation,
  contrast,
  neutralScale,
  scales: _scales,
}: {
  lightness: number;
  saturation: number;
  contrast: number;
  neutralScale: ColorScale;
  scales: ColorScale[];
}) => {
  const neutral = new LeonardoBgColor({
    name: "neutral",
    colorKeys: neutralScale.colorKeys.map((color) => toColorString(color)),
    ratios: createRatiosObject("neutral", neutralScale.ratios),
  });

  const colors = _scales.map(
    (scale) =>
      new LeonardoColor({
        name: scale.name,
        colorKeys: scale.colorKeys.map((color) => toColorString(color)),
        ratios: createRatiosObject(scale.name, scale.ratios),
        smooth: scale.smooth,
      }),
  );

  const generatedTheme = new LeonardoTheme({
    colors,
    backgroundColor: neutral,
    lightness: lightness,
    saturation: saturation,
    contrast: contrast / 100,
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
    ? "hsl(0 0% 0%)"
    : "hsl(0 0% 100%)";
};

export const createModeCssVars = (
  modeDefinition: ModeDefinition,
  generateContrastColors = true,
): Record<string, string> => {
  const colorScales = createColorScales({
    lightness: modeDefinition.lightness,
    saturation: modeDefinition.saturation,
    contrast: modeDefinition.contrast,
    neutralScale: modeDefinition.scales.neutral,
    scales: Object.values(modeDefinition.scales),
  });

  const cssVars = colorScales
    .flatMap((colorScale) =>
      colorScale.values.flatMap((value) =>
        [
          [value.name, value.value] as const,
          generateContrastColors
            ? ([`on-${value.name}`, getContrastColor(value.value)] as const)
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
  const cssThemeVars = Object.entries(tokensDefinition).reduce(
    (acc, [key, value]) => {
      acc[key] = value.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return cssThemeVars;
};

export const createRadiusVars = (radius: Radius): Theme => {
  const themeCssVars = Object.entries(RADIUS_TOKENS).reduce(
    (acc, [key, value]) => {
      acc[key] = value.defaultValue;
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
