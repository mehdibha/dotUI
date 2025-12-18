/**
 * Pure functional implementation of Leonardo color generation
 *
 * This module provides the same functionality as the class-based implementation
 * but using pure functions for better testability and composability.
 */

import ColorJS from "colorjs.io";

import {
	convertColorValue,
	createScale,
	getContrast,
	hsluvArray,
	multiplyRatios,
	ratioName,
	removeDuplicates,
	round,
} from "./utils";
import type { Colorspace, ContrastFormula } from "../../types";

// ============================================================================
// Types
// ============================================================================

export interface ColorScaleOptions {
	colorKeys: string[];
	colorspace?: Colorspace;
	smooth?: boolean;
	saturation?: number;
}

export interface BackgroundScaleOptions {
	colorKeys: string[];
	colorspace?: Colorspace;
}

export interface SearchContrastOptions {
	colorKeys: string[];
	colorspace?: Colorspace;
	smooth?: boolean;
	ratios: number[];
	backgroundRgb: [number, number, number];
	backgroundLightness: number; // 0-1 range
	formula: ContrastFormula;
}

export interface GenerateThemeColorInput {
	name: string;
	colorKeys: string[];
	colorspace?: Colorspace;
	ratios: number[] | Record<string, number>;
	smooth?: boolean;
}

export interface GenerateThemeBackgroundInput {
	name: string;
	colorKeys: string[];
	colorspace?: Colorspace;
}

export interface GenerateThemeOptions {
	colors: GenerateThemeColorInput[];
	backgroundColor: string | GenerateThemeBackgroundInput;
	lightness?: number;
	saturation?: number;
	contrast?: number;
	formula?: ContrastFormula;
}

export interface ContrastColorValue {
	name: string;
	contrast: number;
	value: string;
}

export interface GeneratedTheme {
	background: string;
	backgroundScale: string[];
	colors: Record<string, ContrastColorValue[]>;
}

// ============================================================================
// Pure Functions
// ============================================================================

/**
 * Apply saturation modification to color keys using OKLCH colorspace
 * This is the key to Leonardo parity - uses OKLCH for saturation adjustment
 */
export function applyColorSaturation(colorKeys: string[], saturation: number): string[] {
	if (saturation === 100) {
		return colorKeys;
	}

	return colorKeys.map((key) => {
		const color = new ColorJS(key).to("oklch");
		const currentL = color.coords[0] ?? 0;
		const currentC = color.coords[1] ?? 0;
		const currentH = color.coords[2] ?? 0;
		const newSaturation = currentC * (saturation / 100);
		const newColor = new ColorJS("oklch", [currentL, newSaturation, currentH]);
		return newColor.to("srgb").toString({ format: "hex" });
	});
}

/**
 * Generate a color scale function (3000 swatches) for contrast searching
 */
export function generateColorScaleFn(options: ColorScaleOptions): (pos: number) => string {
	const { colorKeys, colorspace = "RGB", smooth = false, saturation = 100 } = options;

	const modifiedKeys = applyColorSaturation(colorKeys, saturation);

	return createScale({
		swatches: 3000,
		colorKeys: modifiedKeys,
		colorspace,
		shift: 1,
		smooth,
		asFun: true,
	}) as (pos: number) => string;
}

/**
 * Generate a background color scale (100 lightness steps indexed 0-100)
 * Returns array where index = lightness value in HSLuv
 */
export function generateBackgroundScale(options: BackgroundScaleOptions): string[] {
	const { colorKeys, colorspace = "RGB" } = options;

	// Create massive scale for background
	const backgroundColorScale = createScale({
		swatches: 1000,
		colorKeys,
		colorspace,
		shift: 1,
		smooth: false,
	}) as string[];

	// Inject original key colors to ensure they are present
	backgroundColorScale.push(...colorKeys);

	// Convert to HSLuv and track indices
	const colorObj = backgroundColorScale.map((c, i) => ({
		value: Math.round(hsluvArray(c)[2] ?? 0),
		index: i,
	}));

	// Remove duplicates by lightness value
	const colorObjFiltered = removeDuplicates(colorObj, "value");

	// Map back to colors
	const bgColorArrayFiltered = colorObjFiltered.map((data) => backgroundColorScale[data.index]);

	// Cap at 100 colors, add white back if needed
	if (bgColorArrayFiltered.length >= 101) {
		bgColorArrayFiltered.length = 100;
		bgColorArrayFiltered.push("#ffffff");
	}

	// Convert to RGB format (internal processing format)
	return bgColorArrayFiltered.map((color) => convertColorValue(color ?? "#ffffff", "RGB") as string);
}

/**
 * Search for colors matching target contrast ratios using binary search
 */
export function searchContrastColors(options: SearchContrastOptions): string[] {
	const {
		colorKeys,
		colorspace = "RGB",
		smooth = false,
		ratios,
		backgroundRgb,
		backgroundLightness,
		formula,
	} = options;

	const colorLen = 3000;
	const colorScale = createScale({
		swatches: colorLen,
		colorKeys,
		colorspace,
		shift: 1,
		smooth,
		asFun: true,
	}) as (pos: number) => string;

	const ccache: Record<number, number> = {};

	const getContrast2 = (i: number): number => {
		if (ccache[i]) {
			return ccache[i];
		}
		const c = new ColorJS(colorScale(i)).to("srgb");
		const rgb = [
			Math.round((c.coords[0] ?? 0) * 255),
			Math.round((c.coords[1] ?? 0) * 255),
			Math.round((c.coords[2] ?? 0) * 255),
		];
		const contrast = getContrast(rgb, backgroundRgb, backgroundLightness, formula);
		ccache[i] = contrast;
		return contrast;
	};

	const colorSearch = (x: number): number => {
		const first = getContrast2(0);
		const last = getContrast2(colorLen);
		const dir = first < last ? 1 : -1;
		const epsilon = 0.01;
		x += 0.005 * Math.sign(x);
		let step = colorLen / 2;
		let dot = step;
		let val = getContrast2(dot);
		let counter = 100;

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
	for (const ratio of ratios) {
		outputColors.push(colorScale(colorSearch(+ratio)));
	}
	return outputColors;
}

/**
 * Parse background input into normalized form
 */
function parseBackgroundInput(backgroundColor: string | GenerateThemeBackgroundInput): {
	colorKeys: string[];
	colorspace: Colorspace;
} {
	if (typeof backgroundColor === "string") {
		return {
			colorKeys: [backgroundColor],
			colorspace: "RGB",
		};
	}
	return {
		colorKeys: backgroundColor.colorKeys,
		colorspace: backgroundColor.colorspace ?? "RGB",
	};
}

/**
 * Calculate lightness from a color using HSLuv
 */
function calculateLightnessFromColor(color: string): number {
	const hsluvColor = new ColorJS(String(color)).to("hsluv");
	return round(hsluvColor.coords[2] ?? 0);
}

/**
 * Convert color to RGB array [r, g, b] in 0-255 range
 */
function colorToRgb(color: string): [number, number, number] {
	const c = new ColorJS(String(color)).to("srgb");
	return [
		Math.round((c.coords[0] ?? 0) * 255),
		Math.round((c.coords[1] ?? 0) * 255),
		Math.round((c.coords[2] ?? 0) * 255),
	];
}

/**
 * Generate a complete theme with contrast-based color scales
 *
 * This is the main orchestrator function that replaces the Theme class.
 * It generates all color scales based on the provided configuration.
 */
export function generateTheme(options: GenerateThemeOptions): GeneratedTheme {
	const {
		colors,
		backgroundColor,
		lightness: inputLightness,
		saturation = 100,
		contrast = 1,
		formula = "wcag2",
	} = options;

	// Parse background input
	const bgInput = parseBackgroundInput(backgroundColor);

	// Generate background scale
	const backgroundScale = generateBackgroundScale({
		colorKeys: bgInput.colorKeys,
		colorspace: bgInput.colorspace,
	});

	// Determine lightness
	let finalLightness: number;
	if (inputLightness !== undefined) {
		finalLightness = inputLightness;
	} else if (typeof backgroundColor === "string") {
		finalLightness = calculateLightnessFromColor(backgroundColor);
	} else {
		finalLightness = 100; // Default to white
	}

	// Get background color value at the target lightness
	const bgValue = backgroundScale[finalLightness] ?? "#ffffff";
	const bgRgb = colorToRgb(bgValue);
	const baseV = finalLightness / 100;

	// Generate colors for each input color
	const generatedColors: Record<string, ContrastColorValue[]> = {};

	for (const color of colors) {
		// Apply saturation modification
		const modifiedKeys = applyColorSaturation(color.colorKeys, saturation);

		// Get ratio values and names
		let ratioValues: number[];
		let swatchNames: string[] | undefined;

		if (Array.isArray(color.ratios)) {
			ratioValues = color.ratios;
		} else {
			swatchNames = Object.keys(color.ratios);
			ratioValues = Object.values(color.ratios);
		}

		// Modify target ratios based on contrast multiplier
		const adjustedRatios = ratioValues.map((ratio) => multiplyRatios(+ratio, contrast));

		// Search for contrast-matching colors
		const contrastColors = searchContrastColors({
			colorKeys: modifiedKeys,
			colorspace: color.colorspace,
			smooth: color.smooth,
			ratios: adjustedRatios,
			backgroundRgb: bgRgb,
			backgroundLightness: baseV,
			formula,
		});

		// Build output array
		const colorValues: ContrastColorValue[] = [];
		for (let i = 0; i < contrastColors.length; i++) {
			let name: string;
			if (!swatchNames) {
				const rVal =
					ratioName(Array.isArray(color.ratios) ? color.ratios : Object.values(color.ratios), formula)[i] ?? 0;
				name = color.name.concat(String(rVal)).replace(/\s+/g, "");
			} else {
				name = swatchNames[i] ?? "";
			}

			colorValues.push({
				name,
				contrast: adjustedRatios[i] ?? 0,
				value: contrastColors[i] ?? "",
			});
		}

		generatedColors[color.name] = colorValues;
	}

	return {
		background: bgValue,
		backgroundScale,
		colors: generatedColors,
	};
}
