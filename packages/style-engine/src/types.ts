export interface ColorScale {
  baseColors: string[];
  contrastRatios?: number[];
}

export interface ColorPalette {
  neutral: ColorScale;
  accent: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
  info: ColorScale;
}

export interface ColorMode {
  lightness: number;
  saturation: number;
  palette: ColorPalette;
}

export interface ThemeDefinition {
  borderRadius?: number;
  lightMode?: ColorMode;
  darkMode?: ColorMode;
  semanticTokens?: Record<string, string>;
  customProperties?: Record<
    string,
    string | Record<string, string | Record<string, string>>
  >;
}

export interface TypographyScale {
  headingFont: string;
  bodyFont: string;
}

export interface StyleDefinition {
  typography: TypographyScale;
  theme: ThemeDefinition;
  registryVariants: Record<string, string>;
  designTokens: Record<string, string>;
  iconLibrary?: string;
}

export interface ComputedTheme {
  light: Record<string, string>;
  dark: Record<string, string>;
  theme: Record<string, string>;
  css: Record<string, string | Record<string, string | Record<string, string>>>;
}

export interface ComputedStyle {
  name: string;
  label: string;
  icon?: string;
  theme: ComputedTheme;
  typography: TypographyScale;
  registryVariants: Record<string, string>;
  designTokens: Record<string, string>;
  iconLibrary?: string;
}

export type CssColor = string;
