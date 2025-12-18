/**
 * Core types for @dotui/colors
 */

/** Standard 11-step color scale (50-950) */
export interface ColorScale {
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
export const SCALE_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

export type ScaleStep = (typeof SCALE_STEPS)[number];

/** Colorspaces supported for interpolation */
export type Colorspace =
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
// Main createTheme API Types
// ============================================================================

/** Algorithm to use for scale generation */
export type Algorithm = "contrast" | "material";

/** Options for createTheme function */
export interface CreateThemeOptions {
	/**
	 * Brand/primary color (hex)
	 * Required - used to generate accent scale
	 */
	accent: string;

	/**
	 * Background color (hex)
	 * Required - determines theme lightness and contrast direction
	 */
	background: string;

	/**
	 * Neutral base color (hex)
	 * Optional - defaults to desaturated version of accent
	 */
	neutral?: string;

	/**
	 * Success color (hex)
	 * Optional - defaults to green (hue=142°)
	 */
	success?: string;

	/**
	 * Warning color (hex)
	 * Optional - defaults to amber (hue=45°)
	 */
	warning?: string;

	/**
	 * Danger/error color (hex)
	 * Optional - defaults to red (hue=25°)
	 */
	danger?: string;

	/**
	 * Algorithm to use for scale generation
	 * @default 'contrast'
	 */
	algorithm?: Algorithm;

	/**
	 * Background lightness override (0-100)
	 * Optional - defaults to calculated from background color
	 */
	lightness?: number;

	/**
	 * Global saturation modifier (0-100)
	 * @default 100
	 */
	saturation?: number;

	/**
	 * Contrast multiplier
	 * @default 1
	 */
	contrast?: number;
}

/** Output from createTheme function */
export interface Theme {
	/** Background color (HSL string) */
	background: string;

	/** Generated color scales */
	scales: {
		neutral: ColorScale;
		accent: ColorScale;
		success: ColorScale;
		warning: ColorScale;
		danger: ColorScale;
	};
}
