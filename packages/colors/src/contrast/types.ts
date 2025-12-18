/**
 * Types for contrast-based algorithm
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
