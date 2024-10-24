import {
  contrast,
  convertColorValue,
  type ColorTuple,
  Theme,
  Color,
  BackgroundColor,
  type CssColor,
} from "@adobe/leonardo-contrast-colors";
import { ColorShade, ModeConfig } from "@/types/theme";

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

const defaultConfig = {
  light: {
    saturation: 100,
    lightness: 97,
    colors: {
      neutral: {
        baseColors: ["#000000"],
        ratios: [1, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
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
};

type ColorConfig = {
  baseColors: string[];
  ratios?: number[];
};

type BuildColorScalesProps = {
  neutral: ColorConfig;
  accent: ColorConfig;
  warning: ColorConfig;
  success: ColorConfig;
  danger: ColorConfig;
  lightness: number;
  saturation: number;
  mode: "light" | "dark";
};

export const buildColorScales = ({
  neutral: neutralConfig,
  lightness,
  saturation,
  mode,
  ...props
}: BuildColorScalesProps): ModeConfig => {
  const neutral = new BackgroundColor({
    name: "neutral",
    colorKeys: neutralConfig.baseColors as CssColor[],
    ratios: neutralConfig.ratios ?? defaultConfig[mode].colors.neutral.ratios,
  });

  const colorScales = Object.entries(props).map(([name, config]) => {
    return new Color({
      name,
      colorKeys: config.baseColors as CssColor[],
      ratios:
        config.ratios ??
        defaultConfig[mode].colors[
          name as keyof (typeof defaultConfig)[typeof mode]["colors"]
        ].ratios,
    });
  });

  const theme = new Theme({
    colors: [neutral, ...colorScales],
    backgroundColor: neutral,
    lightness,
    saturation,
    output: "HSL",
  });

  const [_, ...contrastColors] = theme.contrastColors;

  return {
    neutral: {
      baseColor: neutralConfig.baseColors[0],
      shades: contrastColors
        .find((color) => color.name === "neutral")
        ?.values.map((c) => c.value) as ColorShade,
    },
    success: {
      baseColor: props.success.baseColors[0],
      shades: contrastColors
        .find((color) => color.name === "success")
        ?.values.map((c) => c.value) as ColorShade,
    },
    warning: {
      baseColor: props.warning.baseColors[0],
      shades: contrastColors
        .find((color) => color.name === "warning")
        ?.values.map((c) => c.value) as ColorShade,
    },
    danger: {
      baseColor: props.danger.baseColors[0],
      shades: contrastColors
        .find((color) => color.name === "danger")
        ?.values.map((c) => c.value) as ColorShade,
    },
    accent: {
      baseColor: props.accent.baseColors[0],
      shades: contrastColors
        .find((color) => color.name === "accent")
        ?.values.map((c) => c.value) as ColorShade,
    },
    lightness,
    saturation,
  };
};

// const neutralScale = new Color({
//   name: "neutral",
//   colorKeys: ["#000000"],
//   ratios:
// });
// const theme = new Theme({
//   colors: [neutral, ...colorScales],
//   backgroundColor: neutral,
//   lightness: options?.lightness ?? defaultModeConfig.lightness,
//   saturation: options?.saturation ?? defaultModeConfig.saturation,
//   output: "HSL",
// });
// };

// const defaultConfig = {
//   light: {
//     saturation: 100,
//     lightness: 97,
//     colors: {
//       neutral: {
//         baseColors: ["#000000"],
//         ratios: [1, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       primary: {
//         baseColors: ["#ffffff"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       success: {
//         baseColors: ["#1A9338"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       warning: {
//         baseColors: ["#E79D13"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       danger: {
//         baseColors: ["#D93036"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       accent: {
//         baseColors: ["#0091FF"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//     },
//   },
//   dark: {
//     saturation: 100,
//     lightness: 0,
//     colors: {
//       neutral: {
//         baseColors: ["#ffffff"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       primary: {
//         baseColors: ["#000000"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       success: {
//         baseColors: ["#1A9338"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       warning: {
//         baseColors: ["#E79D13"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       danger: {
//         baseColors: ["#D93036"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//       accent: {
//         baseColors: ["#0091FF"],
//         ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
//       },
//     },
//   },
// } as const satisfies Record<ThemeMode, ThemeConfig>;

// export const buildDotUIColorScales = (
//   mode: ThemeMode,
//   colors: Colors,
//   options?: {
//     saturation?: number;
//     lightness?: number;
//   }
// ) => {
//   const defaultModeConfig = defaultConfig[mode];

//   const getColorKeys = (colorBase: keyof Colors) => {
//     const color = colors[colorBase];
//     return Array.isArray(color) ? color : color.baseColors;
//   };

//   const getRatios = (colorBase: keyof Colors) => {
//     const color = colors[colorBase];
//     return Array.isArray(color)
//       ? defaultModeConfig.colors[colorBase].ratios
//       : (color.ratios ?? defaultModeConfig.colors[colorBase].ratios);
//   };

//   const neutral = new BackgroundColor({
//     name: "neutral-",
//     colorKeys: getColorKeys("neutral"),
//     ratios: getRatios("neutral"),
//   });

//   const colorScales = Object.entries(colors)
//     .map(([name]) => {
//       if (name === "neutral") return null;

//       return new Color({
//         name: `${name}-`,
//         colorKeys: getColorKeys(name as keyof Colors),
//         ratios: getRatios(name as keyof Colors),
//       });
//     })
//     .filter(Boolean) as Color[];

//   const theme = new Theme({
//     colors: [neutral, ...colorScales],
//     backgroundColor: neutral,
//     lightness: options?.lightness ?? defaultModeConfig.lightness,
//     saturation: options?.saturation ?? defaultModeConfig.saturation,
//     output: "HSL",
//   });

//   const colorVars = Object.entries(theme.contrastColorPairs).reduce(
//     (acc, [key, value]) => {
//       if (key === "background") {
//         return acc;
//       }
//       const [h, s, l] = value.match(/\d+(\.\d+)?/g) || [];
//       acc[key] = `hsl(${h} ${s}% ${l}%)`;
//       return acc;
//     },
//     {} as Record<string, string>
//   );

//   return colorVars;
// };
