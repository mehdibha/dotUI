/**
 * Main createTheme API
 *
 * Unified interface for generating color themes with sensible defaults.
 *
 * @example
 * import { createTheme } from '@dotui/colors';
 *
 * // Minimal usage
 * const theme = createTheme({
 *   accent: '#6366f1',
 *   background: '#ffffff',
 * });
 *
 * // Full control
 * const theme = createTheme({
 *   neutral: '#64748b',
 *   accent: '#6366f1',
 *   success: '#22c55e',
 *   warning: '#f59e0b',
 *   danger: '#ef4444',
 *   background: '#ffffff',
 *   algorithm: 'contrast',
 * });
 */

import Color from "colorjs.io";

import { generateContrastTheme } from "./algorithms/contrast";
import { DEFAULT_RATIOS, DEFAULT_SEMANTIC_HUES } from "./algorithms/contrast/defaults";
import { generateScale as generateMaterialScale } from "./algorithms/material";
import { SCALE_STEPS } from "./types";
import type { ColorScale, CreateThemeOptions, Theme } from "./types";

// ============================================================================
// Color Utilities
// ============================================================================

/**
 * Convert any color to HSL string format
 */
function toHslString(color: string): string {
	const hsl = new Color(color).to("hsl");
	const h = Math.round(Number.isNaN(hsl.coords[0] ?? 0) ? 0 : (hsl.coords[0] ?? 0));
	const s = Math.round(hsl.coords[1] ?? 0);
	const l = Math.round(hsl.coords[2] ?? 0);
	return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Get OKLCH values from a hex color
 */
function getOklch(hex: string): { l: number; c: number; h: number } {
	const color = new Color(hex).to("oklch");
	return {
		l: color.coords[0] ?? 0,
		c: color.coords[1] ?? 0,
		h: color.coords[2] ?? 0,
	};
}

/**
 * Create a hex color from OKLCH values
 */
function fromOklch(l: number, c: number, h: number): string {
	const color = new Color("oklch", [l, c, Number.isNaN(h) ? 0 : h]);
	return color.to("srgb").toString({ format: "hex" });
}

/**
 * Generate a neutral color from accent by reducing chroma
 */
function generateNeutralFromAccent(accent: string): string {
	const oklch = getOklch(accent);
	// Keep hue, reduce chroma significantly for near-grey
	// OKLCH chroma is typically 0-0.4, use a low value for neutrals
	return fromOklch(0.5, 0.02, oklch.h);
}

/**
 * Generate a semantic color using fixed hue and accent's chroma
 */
function generateSemanticColor(hue: number, accent: string): string {
	const oklch = getOklch(accent);
	// Use accent's chroma for visual consistency (capped to reasonable max), fixed hue for semantics
	const chroma = Math.min(oklch.c, 0.25); // Cap chroma to avoid over-saturation
	return fromOklch(0.5, chroma > 0.05 ? chroma : 0.15, hue);
}

// ============================================================================
// Scale Generators
// ============================================================================

/**
 * Generate a color scale using the contrast algorithm
 */
function generateContrastScale(
	colorHex: string,
	background: string,
	options: { saturation?: number; contrast?: number; lightness?: number },
): ColorScale {
	const result = generateContrastTheme({
		colors: [
			{
				name: "scale",
				colorKeys: [colorHex],
				ratios: [...DEFAULT_RATIOS],
			},
		],
		backgroundColor: background,
		lightness: options.lightness,
		saturation: options.saturation ?? 100,
		contrast: options.contrast ?? 1,
	});

	const scaleColors = result.colors.scale ?? {};

	// Ensure all scale steps are present
	const colorScale: Partial<ColorScale> = {};
	for (const step of SCALE_STEPS) {
		colorScale[step] = scaleColors[step] ?? "";
	}

	return colorScale as ColorScale;
}

/**
 * Generate a color scale using the Material HCT algorithm
 */
function generateMaterialScaleFromHex(colorHex: string): ColorScale {
	const scale = generateMaterialScale({ color: colorHex });

	// Convert hex outputs to HSL
	const hslScale: Partial<ColorScale> = {};
	for (const step of SCALE_STEPS) {
		const hexValue = scale[step];
		if (hexValue) {
			hslScale[step] = toHslString(hexValue);
		}
	}

	return hslScale as ColorScale;
}

// ============================================================================
// Main API
// ============================================================================

/**
 * Create a complete color theme with sensible defaults
 *
 * @param options - Theme configuration
 * @returns Theme with background and color scales in HSL format
 */
export function createTheme(options: CreateThemeOptions): Theme {
	const {
		accent,
		background,
		neutral,
		success,
		warning,
		danger,
		algorithm = "contrast",
		lightness,
		saturation = 100,
		contrast = 1,
	} = options;

	// Resolve colors (use provided or generate defaults)
	const resolvedNeutral = neutral ?? generateNeutralFromAccent(accent);
	const resolvedSuccess = success ?? generateSemanticColor(DEFAULT_SEMANTIC_HUES.success, accent);
	const resolvedWarning = warning ?? generateSemanticColor(DEFAULT_SEMANTIC_HUES.warning, accent);
	const resolvedDanger = danger ?? generateSemanticColor(DEFAULT_SEMANTIC_HUES.danger, accent);

	// Generate scales based on algorithm
	let scales: Theme["scales"];

	if (algorithm === "material") {
		scales = {
			neutral: generateMaterialScaleFromHex(resolvedNeutral),
			accent: generateMaterialScaleFromHex(accent),
			success: generateMaterialScaleFromHex(resolvedSuccess),
			warning: generateMaterialScaleFromHex(resolvedWarning),
			danger: generateMaterialScaleFromHex(resolvedDanger),
		};
	} else {
		// Default: contrast algorithm
		const scaleOptions = { saturation, contrast, lightness };

		scales = {
			neutral: generateContrastScale(resolvedNeutral, background, scaleOptions),
			accent: generateContrastScale(accent, background, scaleOptions),
			success: generateContrastScale(resolvedSuccess, background, scaleOptions),
			warning: generateContrastScale(resolvedWarning, background, scaleOptions),
			danger: generateContrastScale(resolvedDanger, background, scaleOptions),
		};
	}

	return {
		background: toHslString(background),
		scales,
	};
}
