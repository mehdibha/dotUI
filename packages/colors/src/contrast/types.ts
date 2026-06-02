/**
 * Types for contrast-based algorithm
 */

// Scale shape lives in the shared layer (single source of truth) so step count
// and naming stay configurable across every algorithm.
export type { ColorScale } from "../shared/types";
export { SCALE_STEPS } from "../shared/constants";
export type { ScaleStep } from "../shared/constants";

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
