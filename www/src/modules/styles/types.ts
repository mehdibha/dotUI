import { CssColor } from "@adobe/leonardo-contrast-colors";
import type { IconLibrary, Primitives } from "@dotui/schemas";

type ColorFoundation = {
  baseColors: CssColor[];
  ratios?: number[];
  overrides?: Record<string, string>;
};

export type Colors = {
  palettes: {
    neutral: ColorFoundation;
    accent: ColorFoundation;
    success?: ColorFoundation;
    warning?: ColorFoundation;
    danger?: ColorFoundation;
    info?: ColorFoundation;
  };
  lightness?: number;
  saturation?: number;
};

export type Variants = {
  global: "primary" | "accent";
};

export type Theme = {
  name: string;
  label: string;
  description?: string;
  iconLibrary?: IconLibrary;
  fonts?: {
    heading?: string;
    body?: string;
  };
  primitives?: Primitives;
  variants?: Partial<Variants>;
  foundations: {
    light?: Colors;
    dark?: Colors;
    overrides?: Record<string, string>;
  };
  defaultDisplayMode?: "light" | "dark";
};

///////////////////////////////////////////////////////
