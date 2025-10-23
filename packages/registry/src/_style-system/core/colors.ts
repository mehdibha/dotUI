import {
  convertColorValue,
  contrast as getContrast,
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { converter } from "culori";
import { parseColor } from "react-aria-components";
import type { CssColor } from "@adobe/leonardo-contrast-colors";
import type { Color } from "react-aria-components";

import { RADIUS_TOKENS } from "../../tokens/registry";
import { SCALE_STEPS } from "../constants";
import type {
  ColorFormat,
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

/**
 * Converts a HEX color to the specified format.
 * Leonardo only supports HEX output, so we convert post-generation.
 */
export const convertColorFormat = (
  hexColor: string,
  targetFormat: ColorFormat = "oklch",
): string => {
  if (targetFormat === "hex") {
    return hexColor;
  }

  try {
    if (targetFormat === "oklch") {
      // Use culori for OKLCH conversion
      const oklch = converter("oklch");
      const converted = oklch(hexColor);
      if (converted) {
        // Round values for cleaner output
        const l = Number(converted.l.toFixed(3));
        const c = Number(converted.c.toFixed(3));
        const h = converted.h ? Number(converted.h.toFixed(3)) : 0;
        const alpha = converted.alpha !== undefined ? converted.alpha : 1;

        if (alpha < 1) {
          return `oklch(${l} ${c} ${h} / ${alpha})`;
        }
        return `oklch(${l} ${c} ${h})`;
      }
    }

    if (targetFormat === "hsl") {
      // Use react-aria for HSL conversion (it supports this)
      const color = parseColor(hexColor);
      return color.toString("hsl");
    }
  } catch (error) {
    // If parsing fails, return the original color
    console.warn(
      `Failed to convert color ${hexColor} to ${targetFormat}:`,
      error,
    );
    return hexColor;
  }

  return hexColor;
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

export const getContrastColor = (
  colorValue: string,
  colorFormat: ColorFormat = "oklch",
): string => {
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

  const isBlackBetter = contrastWithBlack > contrastWithWhite;
  const hexColor = isBlackBetter ? "#000000" : "#ffffff";

  return convertColorFormat(hexColor, colorFormat);
};

export const createModeCssVars = (
  modeDefinition: ModeDefinition,
  generateContrastColors = true,
  colorFormat: ColorFormat = "oklch",
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
          [value.name, convertColorFormat(value.value, colorFormat)] as const,
          generateContrastColors
            ? ([
                `on-${value.name}`,
                getContrastColor(value.value, colorFormat),
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
