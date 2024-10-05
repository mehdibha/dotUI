import {
  contrast,
  convertColorValue,
  type ColorTuple,
  Theme,
  Color,
  BackgroundColor,
  type CssColor,
} from "@adobe/leonardo-contrast-colors";

export const getContrastTextColor = (color: string): "white" | "black" => {
  const RGBColor = convertColorValue(color, "RGB", true) as unknown as {
    r: number;
    g: number;
    b: number;
  };
  const colorTuple: ColorTuple = [RGBColor.r, RGBColor.g, RGBColor.b];
  const contrastWithBlack = contrast(colorTuple, [0, 0, 0]);
  const contrastWithWhite = contrast(colorTuple, [255, 255, 255]);
  const contrastText =
    contrastWithBlack > contrastWithWhite ? "black" : "white";
  return contrastText;
};

type ThemeMode = "light" | "dark";

type ColorConfig =
  | {
      baseColors: CssColor[];
      ratios?: number[];
    }
  | CssColor[];

type Colors = {
  neutral: ColorConfig;
  accent: ColorConfig;
  primary: ColorConfig;
  success: ColorConfig;
  warning: ColorConfig;
  danger: ColorConfig;
};

type ThemeConfig = {
  saturation: number;
  lightness: number;
  colors: Colors;
};

const defaultConfig = {
  light: {
    saturation: 100,
    lightness: 97,
    colors: {
      neutral: {
        baseColors: ["#000000"],
        ratios: [1, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      primary: {
        baseColors: ["#ffffff"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      success: {
        baseColors: ["#1A9338"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      warning: {
        baseColors: ["#E79D13"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      danger: {
        baseColors: ["#D93036"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      accent: {
        baseColors: ["#0091FF"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
    },
  },
  dark: {
    saturation: 100,
    lightness: 0,
    colors: {
      neutral: {
        baseColors: ["#ffffff"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      primary: {
        baseColors: ["#000000"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      success: {
        baseColors: ["#1A9338"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      warning: {
        baseColors: ["#E79D13"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      danger: {
        baseColors: ["#D93036"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      accent: {
        baseColors: ["#0091FF"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
    },
  },
} as const satisfies Record<ThemeMode, ThemeConfig>;

export const buildDotUIColorScales = (
  mode: ThemeMode,
  colors: Colors,
  options?: {
    saturation?: number;
    lightness?: number;
  }
) => {
  const defaultModeConfig = defaultConfig[mode];

  const getColorKeys = (colorBase: keyof Colors) => {
    const color = colors[colorBase];
    return Array.isArray(color) ? color : color.baseColors;
  };

  const getRatios = (colorBase: keyof Colors) => {
    const color = colors[colorBase];
    return Array.isArray(color)
      ? defaultModeConfig.colors[colorBase].ratios
      : color.ratios ?? defaultModeConfig.colors[colorBase].ratios;
  };

  const neutral = new BackgroundColor({
    name: "neutral-",
    colorKeys: getColorKeys("neutral"),
    ratios: getRatios("neutral"),
  });

  const colorScales = Object.entries(colors)
    .map(([name]) => {
      if (name === "neutral") return null;

      return new Color({
        name: `${name}-`,
        colorKeys: getColorKeys(name as keyof Colors),
        ratios: getRatios(name as keyof Colors),
      });
    })
    .filter(Boolean) as Color[];

  const theme = new Theme({
    colors: [neutral, ...colorScales],
    backgroundColor: neutral,
    lightness: options?.lightness ?? defaultModeConfig.lightness,
    saturation: options?.saturation ?? defaultModeConfig.saturation,
    output: "HSL",
  });

  const colorVars = Object.entries(theme.contrastColorPairs).reduce(
    (acc, [key, value]) => {
      if (key === "background") {
        return acc;
      }
      const [h, s, l] = value.match(/\d+(\.\d+)?/g) || [];
      acc[key] = `hsl(${h} ${s}% ${l}%)`;
      return acc;
    },
    {} as Record<string, string>
  );

  return colorVars;
};
