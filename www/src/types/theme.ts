export type ColorShade = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

type ColorRatios = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type BaseColors = {
  neutral: string;
  accent: string;
  danger: string;
  success: string;
  warning: string;
};

export type BaseColor = keyof BaseColors;

type ColorConfig = {
  baseColor: string;
  shades: ColorShade;
  // ratios: ColorRatios;
};

export type ModeConfig = {
  [K in keyof BaseColors]: ColorConfig;
} & {
  lightness: number;
  saturation: number;
};

export type Theme = {
  id: string;
  name: string;
  colors: {
    light: ModeConfig;
    dark: ModeConfig;
  };
  fonts: {
    heading: string;
    body: string;
  };
  radius: number;
  defaultMode: "light" | "dark";
  // iconLibrary: "lucide" | "phosphor";
};
