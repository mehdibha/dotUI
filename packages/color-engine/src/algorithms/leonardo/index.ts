/**
 * Leonardo theme generation - Functional API
 * 100% parity with Adobe's contrast-colors library
 *
 * @example
 * import { createTheme } from '@dotui/colors';
 *
 * const theme = createTheme({
 *   colors: [
 *     { name: 'accent', colorKeys: ['#6366f1'], ratios: [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15] },
 *     { name: 'success', colorKeys: ['#22c55e'], ratios: [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15] },
 *   ],
 *   backgroundColor: '#ffffff',
 *   lightness: 97,
 *   saturation: 100,
 *   contrast: 1,
 *   formula: 'wcag2',
 * });
 *
 * // Returns:
 * // {
 * //   background: 'hsl(0, 0%, 96%)',
 * //   colors: {
 * //     accent: { '100': 'hsl(239, 84%, 67%)', '200': 'hsl(238, 78%, 61%)', ... },
 * //     success: { '100': 'hsl(142, 76%, 36%)', '200': 'hsl(142, 69%, 31%)', ... },
 * //   }
 * // }
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import ColorJS from "colorjs.io";
import { Theme } from "./theme";
import type { LeonardoColorspace, ContrastFormula } from "../../types";
import { SCALE_STEPS } from "../../types";

export interface ColorInput {
	name: string;
	colorKeys: string[];
	colorspace?: LeonardoColorspace;
	ratios: number[] | Record<string, number>;
	smooth?: boolean;
}

export interface BackgroundColorInput {
	name: string;
	colorKeys: string[];
	colorspace?: LeonardoColorspace;
}

export interface CreateThemeInput {
	colors: ColorInput[];
	backgroundColor: string | BackgroundColorInput;
	lightness?: number;
	contrast?: number;
	saturation?: number;
	formula?: ContrastFormula;
}

export interface CreateThemeOutput {
	background: string;
	colors: Record<string, Record<string, string>>;
}

/**
 * Convert a color value to HSL string format
 */
function toHslString(color: string): string {
	const hsl = new ColorJS(color).to("hsl");
	const h = Math.round(isNaN(hsl.coords[0] ?? 0) ? 0 : (hsl.coords[0] ?? 0));
	const s = Math.round(hsl.coords[1] ?? 0);
	const l = Math.round(hsl.coords[2] ?? 0);
	return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Create a theme with contrast-based color scales
 *
 * Uses Leonardo's algorithm for 100% parity with Adobe's contrast-colors library.
 * Always outputs HSL format for human readability and ColorPicker compatibility.
 *
 * @param input - Theme configuration
 * @returns Theme output with background and color scales in HSL format
 */
export function createTheme(input: CreateThemeInput): CreateThemeOutput {
	const {
		colors,
		backgroundColor,
		lightness,
		contrast = 1,
		saturation = 100,
		formula = "wcag2",
	} = input;

	// Create the Theme instance (internal)
	const theme = new Theme({
		colors: colors.map((c) => ({
			name: c.name,
			colorKeys: c.colorKeys,
			colorspace: c.colorspace,
			ratios: c.ratios,
			smooth: c.smooth,
		})),
		backgroundColor:
			typeof backgroundColor === "string"
				? backgroundColor
				: {
						name: backgroundColor.name,
						colorKeys: backgroundColor.colorKeys,
						colorspace: backgroundColor.colorspace,
					},
		lightness,
		contrast,
		saturation,
		output: "HEX", // Internal processing in HEX, convert to HSL at output
		formula,
	});

	// Get contrast colors from the theme
	const contrastColors = theme.contrastColors;

	// Build the output
	const result: CreateThemeOutput = {
		background: toHslString(theme.backgroundColorValue),
		colors: {},
	};

	// Process each color scale
	for (const item of contrastColors) {
		if ("background" in item) {
			// Skip the background entry
			continue;
		}

		const colorScale: Record<string, string> = {};
		const colorItem = item as { name: string; values: Array<{ name: string; value: string }> };

		// Map values to SCALE_STEPS by index (Leonardo generates 100, 200... but we want 50, 100, 200...)
		for (let i = 0; i < colorItem.values.length; i++) {
			const value = colorItem.values[i];
			if (!value) continue;

			// Use SCALE_STEPS if we have 11 values (standard scale), otherwise use Leonardo's naming
			if (colorItem.values.length === SCALE_STEPS.length) {
				const step = SCALE_STEPS[i];
				if (step) {
					colorScale[step] = toHslString(value.value);
				}
			} else {
				// For non-standard ratios, extract step from name or use index
				const stepMatch = value.name.match(/(\d+)$/);
				if (stepMatch && stepMatch[1]) {
					colorScale[stepMatch[1]] = toHslString(value.value);
				} else {
					colorScale[value.name] = toHslString(value.value);
				}
			}
		}

		result.colors[colorItem.name] = colorScale;
	}

	return result;
}

// Re-export types
export type { LeonardoColorspace, ContrastFormula } from "../../types";
