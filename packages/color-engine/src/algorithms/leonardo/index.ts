/**
 * Leonardo Algorithm - Exact Port
 *
 * A faithful TypeScript port of Adobe's Leonardo contrast-based
 * color scale generation algorithm using chroma-js for exact parity.
 *
 * Original: https://github.com/adobe/leonardo
 * License: Apache-2.0
 */

import { APCAcontrast, sRGBtoY } from "apca-w3";
import chroma from "chroma-js";
import * as ciebase from "ciebase";
import * as ciecam02 from "ciecam02";
import * as hsluv from "hsluv";
import type { ContrastFormula, LeonardoColorspace, LeonardoOptions, RGB, ScaleOutput } from "../../core/types";
import { SCALE_STEPS } from "../../core/utils";

// ============================================================================
// CIECAM02 JCh Setup (exact match to original chroma-plus.js)
// ============================================================================

const cam = ciecam02.cam(
	{
		whitePoint: ciebase.illuminant.D65,
		adaptingLuminance: 40,
		backgroundLuminance: 20,
		surroundType: "average",
		discounting: false,
	},
	ciecam02.cfs("JCh"),
);

const xyz = ciebase.xyz(ciebase.workspace.sRGB, ciebase.illuminant.D65);

/** Convert RGB (0-255) to JCh */
function rgb2jch(rgb: RGB): [number, number, number] {
	const rgbNorm: [number, number, number] = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
	const jch = cam.fromXyz(xyz.fromRgb(rgbNorm));
	return [jch.J, jch.C, jch.h];
}

/** Convert JCh to RGB (0-255) */
function jch2rgb(jch: [number, number, number]): RGB {
	const rgbNorm = xyz.toRgb(cam.toXyz({ J: jch[0], C: jch[1], h: jch[2] }));
	return [Math.round(rgbNorm[0] * 255), Math.round(rgbNorm[1] * 255), Math.round(rgbNorm[2] * 255)];
}

// ============================================================================
// Constants
// ============================================================================

/** Number of steps in the internal color scale for binary search precision */
const SCALE_LENGTH = 3000;

/** Default contrast ratios for 11-step scale */
const DEFAULT_RATIOS = [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15];

/** Binary search epsilon (convergence threshold) */
const EPSILON = 0.01;

/** Maximum binary search iterations */
const MAX_ITERATIONS = 100;

/** Colorspace mapping to chroma-js mode names */
const COLOR_SPACES: Record<LeonardoColorspace, string> = {
	CAM02: "jab",
	CAM02p: "jch",
	HEX: "hex",
	HSL: "hsl",
	HSLuv: "hsluv",
	HSV: "hsv",
	LAB: "lab",
	LCH: "lch",
	RGB: "rgb",
	OKLAB: "oklab",
	OKLCH: "oklch",
};

// ============================================================================
// Utility Functions
// ============================================================================

function round(x: number, n = 0): number {
	const ten = 10 ** n;
	return Math.round(x * ten) / ten;
}

/**
 * Apply contrast multiplier to a ratio (Leonardo-style normalization)
 */
function multiplyRatio(ratio: number, multiplier: number): number {
	let r: number;

	if (ratio > 1) {
		r = (ratio - 1) * multiplier + 1;
	} else if (ratio < -1) {
		r = (ratio + 1) * multiplier - 1;
	} else {
		r = 1;
	}

	return round(r, 2);
}

// ============================================================================
// Luminance & Contrast Calculations
// ============================================================================

/**
 * Calculate relative luminance per WCAG 2.0
 */
function luminance(r: number, g: number, b: number): number {
	const a = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	});
	return a[0]! * 0.2126 + a[1]! * 0.7152 + a[2]! * 0.0722;
}

/**
 * Calculate contrast with directionality (Leonardo-style)
 *
 * For WCAG2:
 * - Light themes (baseV >= 0.5): positive = darker than background, negative = lighter
 * - Dark themes (baseV < 0.5): positive = lighter than background, negative = darker
 */
function getContrast(
	colorRgb: RGB,
	baseRgb: RGB,
	baseV: number | undefined,
	formula: ContrastFormula = "wcag2",
): number {
	// If baseV not provided, calculate from background HSLuv lightness
	if (baseV === undefined) {
		// Convert RGB (0-255) to RGB (0-1) for hsluv
		const rgbNormalized: [number, number, number] = [baseRgb[0] / 255, baseRgb[1] / 255, baseRgb[2] / 255];
		const hsluvValues = hsluv.rgbToHsluv(rgbNormalized);
		const baseLightness = hsluvValues[2]; // L is at index 2
		baseV = round(baseLightness / 100, 2);
	}

	if (formula === "wcag3") {
		// Use APCA contrast
		const apcaValue = APCAcontrast(sRGBtoY(colorRgb), sRGBtoY(baseRgb)) as number;
		// Flip sign for dark themes to match Leonardo convention
		return baseV < 0.5 ? -apcaValue : apcaValue;
	}

	// WCAG 2 contrast calculation
	const colorLum = luminance(colorRgb[0], colorRgb[1], colorRgb[2]);
	const baseLum = luminance(baseRgb[0], baseRgb[1], baseRgb[2]);

	// cr1 >= 1 when color is darker than base
	// cr2 >= 1 when color is lighter than base
	const cr1 = (colorLum + 0.05) / (baseLum + 0.05);
	const cr2 = (baseLum + 0.05) / (colorLum + 0.05);

	if (baseV < 0.5) {
		// Dark theme: positive = lighter (higher contrast), negative = darker
		if (cr1 >= 1) {
			return cr1; // color is darker than background
		}
		return -cr2; // color is lighter than background
	}

	// Light theme: positive = darker (higher contrast), negative = lighter
	if (cr1 < 1) {
		return cr2; // color is lighter than background
	}
	if (cr1 === 1) {
		return cr1;
	}
	return -cr1; // color is darker than background
}

// ============================================================================
// Scale Creation (exact port from original)
// ============================================================================

/**
 * Create power scale function for domain mapping
 */
function makePowScale(
	exp = 1,
	domains: [number, number] = [0, 1],
	range: [number, number] = [0, 1],
): (x: number) => number {
	const m = (range[1] - range[0]) / (domains[1] ** exp - domains[0] ** exp);
	const c = range[0] - m * domains[0] ** exp;
	return (x: number) => m * x ** exp + c;
}

/**
 * Create a color scale function (exact port from original createScale)
 */
function createScale(
	colorKeys: string[],
	colorspace: LeonardoColorspace,
	swatches: number,
	smooth = false,
): (position: number) => string {
	const space = COLOR_SPACES[colorspace];
	if (!space) {
		throw new Error(`Colorspace "${colorspace}" not supported`);
	}

	// Calculate domains based on JCh lightness (J from CIECAM02) - exact match to original
	let domains = colorKeys
		.map((key) => {
			const rgb = chroma(key).rgb() as RGB;
			const jch = rgb2jch(rgb);
			return swatches - swatches * (jch[0] / 100);
		})
		.sort((a, b) => a - b)
		.concat(swatches);

	domains.unshift(0);

	// Apply power scaling for smoother distribution
	const sqrtDomains = makePowScale(1, [1, swatches], [1, swatches]);
	domains = domains.map((d) => Math.max(0, sqrtDomains(d)));

	// Sort colors by JCh lightness (brightest first) - exact match to original
	const sortedColors = colorKeys
		.map((c, i) => {
			const rgb = chroma(c).rgb() as RGB;
			const jch = rgb2jch(rgb);
			return { color: jch, index: i };
		})
		.sort((c1, c2) => c2.color[0] - c1.color[0])
		.map((data) => colorKeys[data.index]!);

	// Build full scale with white and black endpoints
	const white = space === "lch" ? chroma.lch(...chroma("#fff").lch()) : "#ffffff";
	const black = space === "lch" ? chroma.lch(...chroma("#000").lch()) : "#000000";
	const colorsArray = [white, ...sortedColors, black];

	// Create chroma scale
	const scale = chroma
		.scale(
			colorsArray.map((color) => {
				if (typeof color === "object" && color.constructor.name === "Color") {
					return color;
				}
				return String(color);
			}),
		)
		.domain(domains)
		.mode(space as chroma.InterpolationMode);

	return (pos: number): string => {
		return scale(pos).hex();
	};
}

// ============================================================================
// Color Search (Binary Search - exact port from original)
// ============================================================================

/**
 * Search for colors at specific contrast ratios using binary search
 */
function searchColors(
	colorKeys: string[],
	colorspace: LeonardoColorspace,
	bgRgb: RGB,
	baseV: number,
	ratios: number[],
	formula: ContrastFormula,
	smooth = false,
): string[] {
	const colorLen = SCALE_LENGTH;
	const colorScale = createScale(colorKeys, colorspace, colorLen, smooth);

	// Cache for contrast calculations
	const ccache: Record<number, number> = {};

	const getContrast2 = (i: number): number => {
		if (ccache[i] !== undefined) {
			return ccache[i]!;
		}
		const rgb = chroma(colorScale(i)).rgb() as RGB;
		const c = getContrast(rgb, bgRgb, baseV, formula);
		ccache[i] = c;
		return c;
	};

	const colorSearch = (x: number): number => {
		const first = getContrast2(0);
		const last = getContrast2(colorLen);
		const dir = first < last ? 1 : -1;
		const epsilon = EPSILON;
		x += 0.005 * Math.sign(x);
		let step = colorLen / 2;
		let dot = step;
		let val = getContrast2(dot);
		let counter = MAX_ITERATIONS;

		while (Math.abs(val - x) > epsilon && counter) {
			counter--;
			step /= 2;
			if (val < x) {
				dot += step * dir;
			} else {
				dot -= step * dir;
			}
			val = getContrast2(dot);
		}

		return round(dot, 3);
	};

	const outputColors: string[] = [];
	ratios.forEach((ratio) => {
		outputColors.push(colorScale(colorSearch(+ratio)));
	});

	return outputColors;
}

// ============================================================================
// Saturation Modification
// ============================================================================

/**
 * Modify color saturation using OKLCH chroma
 */
function modifySaturation(hex: string, saturationPercent: number): string {
	const oklch = chroma(hex).oklch();
	const newChroma = oklch[1] * (saturationPercent / 100);
	return chroma.oklch(oklch[0], newChroma, oklch[2]).hex();
}

// ============================================================================
// Main API
// ============================================================================

/**
 * Generate a color scale using the Leonardo algorithm
 *
 * This is an exact port of Adobe's Leonardo algorithm with:
 * - Binary search for exact contrast ratios
 * - WCAG 2 and WCAG 3 (APCA) support
 * - Multiple colorspace interpolation (LAB, LCH, OKLCH, etc.)
 * - JCh lightness for domain positioning (exact match to original)
 *
 * @param options - Configuration options
 * @returns ScaleOutput with 11 steps (50-950)
 */
export function generateScale(options: LeonardoOptions): ScaleOutput {
	const {
		color,
		background,
		colorKeys = [],
		ratios = DEFAULT_RATIOS,
		colorspace = "LAB",
		saturation = 100,
		contrast = 1,
		smooth = false,
		formula = "wcag2",
	} = options;

	// Combine primary color with additional color keys
	const allColorKeys = [color, ...colorKeys];

	// Apply saturation modification if needed
	const modifiedColorKeys =
		saturation < 100 ? allColorKeys.map((c) => modifySaturation(c, saturation)) : allColorKeys;

	// Parse background
	const bgRgb = chroma(background).rgb() as RGB;
	// Use HSLuv lightness for baseV (exact match to original)
	const rgbNormalized: [number, number, number] = [bgRgb[0] / 255, bgRgb[1] / 255, bgRgb[2] / 255];
	const hsluvValues = hsluv.rgbToHsluv(rgbNormalized);
	const baseLightness = hsluvValues[2]; // L is at index 2
	const baseV = round(baseLightness / 100, 2);

	// Apply contrast multiplier to ratios
	const adjustedRatios = ratios.map((r) => multiplyRatio(r, contrast));

	// Search for colors at each ratio
	const colors = searchColors(modifiedColorKeys, colorspace, bgRgb, baseV, adjustedRatios, formula, smooth);

	// Map to standard scale output
	const output: Partial<ScaleOutput> = {};
	SCALE_STEPS.forEach((step, index) => {
		if (index < colors.length) {
			output[step] = colors[index];
		}
	});

	return output as ScaleOutput;
}

// ============================================================================
// Additional Exports
// ============================================================================

/**
 * Calculate contrast between two colors with directionality
 *
 * @param foreground - Foreground color as RGB tuple
 * @param background - Background color as RGB tuple
 * @param baseV - Background lightness (0-1), optional
 * @param formula - Contrast formula ('wcag2' or 'wcag3')
 * @returns Signed contrast value (positive = darker than bg in light themes)
 */
export function contrast(
	foreground: RGB,
	background: RGB,
	baseV?: number,
	formula: ContrastFormula = "wcag2",
): number {
	return getContrast(foreground, background, baseV, formula);
}

/**
 * Create a color scale function for custom use
 *
 * @param colorKeys - Array of hex color strings
 * @param colorspace - Colorspace for interpolation
 * @param swatches - Number of steps in the scale (default: 3000)
 * @returns Function that takes a position and returns a hex color
 */
export function createColorScale(
	colorKeys: string[],
	colorspace: LeonardoColorspace = "LAB",
	swatches = SCALE_LENGTH,
): (position: number) => string {
	return createScale(colorKeys, colorspace, swatches);
}

// Re-export types
export type { LeonardoOptions, LeonardoColorspace, ContrastFormula };
