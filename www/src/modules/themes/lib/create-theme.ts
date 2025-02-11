import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { RegistryTheme } from "@dotui/schemas";
import { Colors, Theme } from "@/modules/themes/types";

export const createTheme = (theme: Theme): RegistryTheme => {
  const { foundations, ...propreties } = theme;

  return {
    ...defaultTheme,
    ...propreties,
    css: {
      colors: {
        ...(foundations.light
          ? { light: createThemeCssVars(foundations, "light") }
          : {}),
        ...(foundations.dark
          ? { dark: createThemeCssVars(foundations, "dark") }
          : {}),
      },
    },
  };
};

export const createThemeCssVars = (
  foundations: Theme["foundations"],
  mode: "light" | "dark"
): Record<string, string> => {
  const resolvedMode = mode;
  if (!foundations[mode]) throw new Error(`No ${mode} mode found in theme`);
  const themeFoundations = foundations[resolvedMode]!;
  const defaultFoundations = defaultColorsFoundations[resolvedMode];

  const neutral = new LeonardoBgColor({
    name: "neutral",
    colorKeys: themeFoundations.palettes.neutral.baseColors,
    ratios:
      themeFoundations.palettes.neutral.ratios ??
      defaultFoundations.palettes.neutral.ratios,
  });

  const colorScales = Object.entries(defaultFoundations.palettes).map(
    ([name]) =>
      new LeonardoColor({
        name,
        colorKeys:
          themeFoundations.palettes[name as keyof Colors["palettes"]]
            ?.baseColors ??
          defaultFoundations.palettes[name as keyof Colors["palettes"]]
            .baseColors,
        ratios:
          themeFoundations.palettes[name as keyof Colors["palettes"]]?.ratios ??
          defaultFoundations.palettes[name as keyof Colors["palettes"]].ratios,
      })
  );

  const lightness = themeFoundations.lightness ?? defaultFoundations.lightness;
  const saturation =
    themeFoundations.saturation ?? defaultFoundations.saturation;

  const generatedTheme = new LeonardoTheme({
    colors: colorScales,
    backgroundColor: neutral,
    lightness,
    saturation,
    output: "HSL",
  });

  const cssVariables = generatedTheme.contrastColors
    .map((color) => {
      if ("name" in color) {
        return color.values.map((value, index) => {
          const scale = (index + 1) * 100;
          return [`--${color.name}-${scale}`, value.value];
        });
      }
      return undefined;
    })
    .filter(Boolean)
    .flatMap((color) => color as [string, string][])
    .reduce((acc, curr) => ({ ...acc, ...{ [curr[0]]: curr[1] } }), {});

  return cssVariables;
};

const defaultColorsFoundations = {
  light: {
    saturation: 100,
    lightness: 97,
    palettes: {
      neutral: {
        baseColors: ["#000000"],
        ratios: [1.05, 1.25, 1.7, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      accent: {
        baseColors: ["#0091FF"],
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
      info: {
        baseColors: ["#0091FF"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
    },
  },
  dark: {
    saturation: 100,
    lightness: 0,
    palettes: {
      neutral: {
        baseColors: ["#ffffff"],
        ratios: [1, 1.25, 1.7, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
      accent: {
        baseColors: ["#0091FF"],
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
      info: {
        baseColors: ["#0091FF"],
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
      },
    },
  },
} as const satisfies Theme["foundations"];

const defaultTheme: Omit<RegistryTheme, "name" | "label" | "css"> = {
  iconLibrary: "lucide-icons",
  primitives: {},
};
