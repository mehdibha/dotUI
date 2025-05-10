import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { converter, formatCss } from "culori";
import {
  DEFAULT_CSS,
  DEFAULT_DARK_FOUNDATIONS,
  DEFAULT_LIGHT_FOUNDATIONS,
  DEFAULT_RADIUS_FACTOR,
  DEFAULT_THEME,
} from "@/modules/styles-2/constants/defaults";
import {
  Theme,
  ThemeFoundations,
  ThemeModeFoundations,
} from "@/modules/styles-2/types";
import { Colors } from "@/modules/styles/types";

export const createTheme = (opts: ThemeFoundations): Theme => {
  const light = opts.light ? createThemeCSSVars(opts.light, "light") : {};
  const dark = opts.dark ? createThemeCSSVars(opts.dark, "dark") : {};
  const theme = { ...DEFAULT_THEME, ...opts.theme };
  const css = { ...DEFAULT_CSS, ...opts.css };
  const radius = opts.radius ?? DEFAULT_RADIUS_FACTOR;

  return {
    light: { "radius-factor": radius.toString(), ...light },
    dark,
    theme,
    css,
  };
};

const createThemeCSSVars = (
  foundations: ThemeModeFoundations,
  mode: "light" | "dark"
) => {
  const defaultFoundations =
    mode === "light" ? DEFAULT_LIGHT_FOUNDATIONS : DEFAULT_DARK_FOUNDATIONS;

  const neutral = new LeonardoBgColor({
    name: "neutral",
    colorKeys:
      foundations.colors.neutral?.baseColors ??
      defaultFoundations.colors.neutral.baseColors,
    ratios:
      foundations.colors.neutral?.ratios ??
      defaultFoundations.colors.neutral.ratios,
  });

  const colorScales = Object.entries(defaultFoundations.colors).map(
    ([name]) =>
      new LeonardoColor({
        name,
        colorKeys:
          foundations.colors[name as keyof Colors["palettes"]]?.baseColors ??
          defaultFoundations.colors[name as keyof Colors["palettes"]]
            .baseColors,
        ratios:
          foundations.colors[name as keyof Colors["palettes"]]?.ratios ??
          defaultFoundations.colors[name as keyof Colors["palettes"]].ratios,
      })
  );

  const lightness = foundations.lightness ?? defaultFoundations.lightness;
  const saturation = foundations.saturation ?? defaultFoundations.saturation;

  const generatedTheme = new LeonardoTheme({
    colors: colorScales,
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
    .filter(Boolean)
    .flatMap((color) => color as [string, string][][])
    .reduce(
      (acc, curr) => {
        const result: Record<string, string> = {};
        curr.forEach(([key, value]) => {
          result[key] = value;
        });
        return { ...acc, ...result };
      },
      {} as Record<string, string>
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
