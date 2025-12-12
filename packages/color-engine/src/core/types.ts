/**
 * Core types for @dotui/color-engine
 */

// ============================================================================
// Color Types
// ============================================================================

/** RGB color as tuple [r, g, b] where values are 0-255 */
export type RGB = [number, number, number];

/** OKLCH color object */
export interface OKLCH {
  l: number; // Lightness 0-1
  c: number; // Chroma 0-0.4+
  h: number; // Hue 0-360
}

/** HSL color object */
export interface HSL {
  h: number; // Hue 0-360
  s: number; // Saturation 0-100
  l: number; // Lightness 0-100
}

// ============================================================================
// Scale Output
// ============================================================================

/** Standard 11-step scale output (50-950) */
export interface ScaleOutput {
  "50": string;
  "100": string;
  "200": string;
  "300": string;
  "400": string;
  "500": string;
  "600": string;
  "700": string;
  "800": string;
  "900": string;
  "950": string;
}

/** Step names for 11-step scale */
export const SCALE_STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

export type ScaleStep = (typeof SCALE_STEPS)[number];

// ============================================================================
// Algorithm Types
// ============================================================================

export type Algorithm = "leonardo" | "material" | "radix";

// ============================================================================
// Leonardo Types
// ============================================================================

/** Colorspaces supported by Leonardo for interpolation */
export type LeonardoColorspace =
  | "RGB"
  | "HEX"
  | "HSL"
  | "HSLuv"
  | "HSV"
  | "LAB"
  | "LCH"
  | "OKLAB"
  | "OKLCH"
  | "CAM02"
  | "CAM02p";

/** Contrast formula options */
export type ContrastFormula = "wcag2" | "wcag3";

/** Leonardo algorithm options */
export interface LeonardoOptions {
  /** Primary color (hex) */
  color: string;

  /** Background color for contrast calculations (hex) */
  background: string;

  /** Additional color keys for gradient interpolation */
  colorKeys?: string[];

  /**
   * Target contrast ratios for each step
   * @default [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15]
   */
  ratios?: number[];

  /**
   * Colorspace for interpolation
   * @default 'OKLCH'
   */
  colorspace?: LeonardoColorspace;

  /**
   * Saturation modifier (0-100)
   * @default 100
   */
  saturation?: number;

  /**
   * Contrast multiplier - scales all ratios
   * @default 1
   */
  contrast?: number;

  /**
   * Use smooth Bezier interpolation
   * @default false
   */
  smooth?: boolean;

  /**
   * Contrast calculation formula
   * @default 'wcag2'
   */
  formula?: ContrastFormula;
}

// ============================================================================
// Material Types
// ============================================================================

/** Material algorithm options */
export interface MaterialOptions {
  /** Source color (hex) */
  color: string;

  /**
   * Specific tone values to generate (0-100)
   * @default [99, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10]
   */
  tones?: number[];

  /**
   * Override chroma value (0-150+)
   * If not provided, uses source color's chroma
   */
  chroma?: number;

  /**
   * Override hue value (0-360)
   * If not provided, uses source color's hue
   */
  hue?: number;

  /**
   * Contrast level adjustment (-1 to 1)
   * -1 = reduced, 0 = standard, 1 = high
   * @default 0
   */
  contrastLevel?: number;
}

// ============================================================================
// Radix Types
// ============================================================================

/** Radix algorithm options */
export interface RadixOptions {
  /** Accent/brand color (hex) */
  accent: string;

  /** Background color (hex) */
  background: string;

  /**
   * Gray base color (hex)
   * If not provided, auto-detected from accent
   */
  gray?: string;
}

/** Available predefined Radix scale names */
export type RadixScaleName =
  // Grays
  | "gray"
  | "mauve"
  | "slate"
  | "sage"
  | "olive"
  | "sand"
  // Colors
  | "tomato"
  | "red"
  | "ruby"
  | "crimson"
  | "pink"
  | "plum"
  | "purple"
  | "violet"
  | "iris"
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "jade"
  | "green"
  | "grass"
  | "brown"
  | "bronze"
  | "gold"
  | "sky"
  | "mint"
  | "lime"
  | "yellow"
  | "amber"
  | "orange";

// ============================================================================
// Unified API Types
// ============================================================================

/** Input for Leonardo algorithm via unified API */
export interface LeonardoInput extends LeonardoOptions {
  algorithm: "leonardo";
}

/** Input for Material algorithm via unified API */
export interface MaterialInput extends MaterialOptions {
  algorithm: "material";
}

/** Input for Radix algorithm via unified API */
export interface RadixInput extends RadixOptions {
  algorithm: "radix";
}

/** Unified generateScale input (discriminated union) */
export type GenerateScaleInput = LeonardoInput | MaterialInput | RadixInput;
