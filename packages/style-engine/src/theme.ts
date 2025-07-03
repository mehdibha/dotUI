import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { converter } from "culori";

import {
  DEFAULT_CSS,
  DEFAULT_DARK_FOUNDATIONS,
  DEFAULT_LIGHT_FOUNDATIONS,
  DEFAULT_RADIUS_FACTOR,
  DEFAULT_THEME,
} from "./constants";
import type {
  ColorDefinition,
  Theme,
  ThemeDefinition,
  ThemeModeDefinition,
} from "./types";

export const createTheme = (opts: ThemeDefinition): Theme => {
  const radius = opts.radius ?? DEFAULT_RADIUS_FACTOR;
  const light = opts.light ? createThemeCSSVars(opts.light, "light") : {};
  const dark = opts.dark ? createThemeCSSVars(opts.dark, "dark") : {};

  const theme: Record<string, string> = {
    "radius-factor": radius.toString(),
    ...DEFAULT_THEME,
    ...opts.theme,
  };
  const css = { ...DEFAULT_CSS, ...opts.css };

  return {
    css,
    cssVars: {
      light,
      dark,
      theme,
    },
  };
};

const createThemeCSSVars = (
  foundations: ThemeModeDefinition,
  mode: "light" | "dark",
) => {
  const defaultDefinition =
    mode === "light" ? DEFAULT_LIGHT_FOUNDATIONS : DEFAULT_DARK_FOUNDATIONS;

  const neutral = new LeonardoBgColor({
    name: "neutral",
    colorKeys:
      foundations.colors.neutral?.baseColors ??
      defaultDefinition.colors.neutral.baseColors,
    ratios:
      foundations.colors.neutral?.ratios ??
      defaultDefinition.colors.neutral.ratios,
  });

  const colors = Object.entries(defaultDefinition.colors).map(([name]) => {
    const props = {
      name,
      colorKeys:
        foundations.colors[name as keyof ColorDefinition]?.baseColors ??
        defaultDefinition.colors[name as keyof ColorDefinition].baseColors,
      ratios:
        foundations.colors[name as keyof ColorDefinition]?.ratios ??
        defaultDefinition.colors[name as keyof ColorDefinition].ratios,
    };
    const color = new LeonardoColor(props);

    return color;
  });

  const lightness = foundations.lightness ?? defaultDefinition.lightness;
  const saturation = foundations.saturation ?? defaultDefinition.saturation;

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

          // TODO: CREATE FOREGROUNDS DYNAMICALLY

          // if (createForegrounds) {
          //   const bgColor = item.value;
          //   const fg = getContrastTextColor(bgColor.replace("deg", ""));
          //   entries.push([`--${color.name}-${scale}-fg`, fg]);
          // }

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

  return cssVariables;
};

const hexToOklchString = (hex: string): string => {
  const toOklch = converter("oklch");
  const color = toOklch(hex);
  if (!color) return "";
  const { l, c, h } = color;
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h?.toFixed(3) ?? 0})`;
};
