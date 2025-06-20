import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { converter } from "culori";

import type {
  ColorMode,
  ColorPalette,
  ComputedTheme,
  ThemeDefinition,
} from "../types";
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_CUSTOM_PROPERTIES,
  DEFAULT_DARK_MODE,
  DEFAULT_LIGHT_MODE,
  DEFAULT_SEMANTIC_TOKENS,
} from "../constants";

export const createTheme = (definition: ThemeDefinition): ComputedTheme => {
  const borderRadius = definition.borderRadius ?? DEFAULT_BORDER_RADIUS;
  const light = definition.lightMode
    ? createColorModeVariables(definition.lightMode, "light")
    : {};
  const dark = definition.darkMode
    ? createColorModeVariables(definition.darkMode, "dark")
    : {};
  const theme = {
    "radius-factor": borderRadius.toString(),
    ...DEFAULT_SEMANTIC_TOKENS,
    ...definition.semanticTokens,
  };
  const css = {
    ...DEFAULT_CUSTOM_PROPERTIES,
    ...definition.customProperties,
  };

  return {
    light,
    dark,
    theme,
    css,
  };
};

const createColorModeVariables = (
  colorMode: ColorMode,
  mode: "light" | "dark",
): Record<string, string> => {
  const defaultMode = mode === "light" ? DEFAULT_LIGHT_MODE : DEFAULT_DARK_MODE;

  const neutral = new LeonardoBgColor({
    name: "neutral",
    colorKeys:
      colorMode.palette.neutral?.baseColors ??
      defaultMode.palette.neutral.baseColors,
    ratios:
      colorMode.palette.neutral?.contrastRatios ??
      defaultMode.palette.neutral.contrastRatios,
  });

  const colors = Object.entries(defaultMode.palette).map(([name]) => {
    const colorKey = name as keyof ColorPalette;
    const props = {
      name,
      colorKeys:
        colorMode.palette[colorKey]?.baseColors ??
        defaultMode.palette[colorKey]?.baseColors,
      ratios:
        colorMode.palette[colorKey]?.contrastRatios ??
        defaultMode.palette[colorKey]?.contrastRatios,
    };
    return new LeonardoColor(props);
  });

  const lightness = colorMode.lightness ?? defaultMode.lightness;
  const saturation = colorMode.saturation ?? defaultMode.saturation;

  const generatedTheme = new LeonardoTheme({
    colors,
    backgroundColor: neutral,
    lightness,
    saturation,
    output: "HEX",
  });

  const cssVariables = generatedTheme.contrastColors
    .map((color) => {
      if ("name" in color) {
        return color.values.map((item, index) => {
          const scale = (index + 1) * 100;
          const entries: [string, string][] = [
            [`${color.name}-${scale}`, hexToOklchString(item.value)],
          ];
          return entries;
        });
      }
      return undefined;
    })
    .filter(Boolean)
    .flatMap((color) => color!)
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

  return cssVariables;
};

const hexToOklchString = (hex: string): string => {
  const toOklch = converter("oklch");
  const color = toOklch(hex);
  if (!color) return "";
  const { l, c, h } = color;
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h?.toFixed(3) ?? 0})`;
};
