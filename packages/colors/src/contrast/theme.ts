import type { z } from "zod";

import { DEFAULT_MODES, SCALE_STEPS, SEMANTIC_COLORS } from "../shared/constants";
import { DEFAULT_DARK_LIGHTNESS, DEFAULT_LIGHT_LIGHTNESS, DEFAULT_RATIOS } from "./defaults";
import { generateBackgroundScale, generateTheme } from "./generate";
import type { ColorScale, Theme } from "../shared/types";
import type { createContrastThemeOptionsSchema, modeSchema } from "./schema";
import type { ContrastFormula } from "./types";

// ============================================================================
// Types
// ============================================================================

export type CreateContrastThemeOptions = z.infer<typeof createContrastThemeOptionsSchema>;
type Mode = z.infer<typeof modeSchema>;

interface ResolvedModeConfig {
	lightness: number;
	palettes: Record<string, { color?: string; ratios?: number[] }>;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Resolve mode config with defaults
 */
function resolveModeConfig(name: string, config: Mode): ResolvedModeConfig {
	if (config === true) {
		const lightness = name.toLowerCase().includes("dark") ? DEFAULT_DARK_LIGHTNESS : DEFAULT_LIGHT_LIGHTNESS;
		return { lightness, palettes: {} };
	}

	const lightness =
		config.lightness ?? (name.toLowerCase().includes("dark") ? DEFAULT_DARK_LIGHTNESS : DEFAULT_LIGHT_LIGHTNESS);
	return { lightness, palettes: config.palettes ?? {} };
}

/**
 * Build base palettes from global config
 */
function buildBasePalettes(palettes: CreateContrastThemeOptions["palettes"]): Map<string, string> {
	const result = new Map<string, string>();

	// Primary (required)
	result.set("primary", palettes.primary);

	// Neutral - from provided color or derive from primary (desaturated)
	if (palettes.neutral) {
		result.set("neutral", palettes.neutral);
	} else {
		// For contrast, we'll use primary as neutral base (generateTheme handles desaturation)
		result.set("neutral", palettes.primary);
	}

	// Semantic and custom palettes
	for (const [name, value] of Object.entries(palettes)) {
		if (name === "primary" || name === "neutral") continue;

		if (value === true) {
			const defaultColor = SEMANTIC_COLORS[name];
			if (defaultColor) result.set(name, defaultColor);
		} else if (typeof value === "string") {
			result.set(name, value);
		}
	}

	return result;
}

/**
 * Get background color from neutral at target lightness
 */
function getBackgroundFromNeutral(neutralColor: string, lightness: number): string {
	const scale = generateBackgroundScale({ colorKeys: [neutralColor], colorspace: "OKLCH" });
	return scale[lightness] ?? "#ffffff";
}

/**
 * Map ContrastColorValue array to ColorScale object
 */
function mapToColorScale(values: { name: string; value: string }[]): ColorScale {
	const scale: Partial<ColorScale> = {};
	for (let i = 0; i < SCALE_STEPS.length && i < values.length; i++) {
		const step = SCALE_STEPS[i]!;
		scale[step] = values[i]!.value;
	}
	return scale as ColorScale;
}

// ============================================================================
// Main Export
// ============================================================================

/**
 * Create a Contrast theme using Leonardo's algorithm
 *
 * @example
 * ```ts
 * const theme = createContrastTheme({
 *   palettes: {
 *     primary: "#6366f1",
 *     success: true,
 *   },
 *   modes: {
 *     light: true,
 *     dark: true,
 *   },
 * });
 * ```
 */
export function createContrastTheme(options: CreateContrastThemeOptions): Theme {
	const basePalettes = buildBasePalettes(options.palettes);
	const modes = options.modes ?? DEFAULT_MODES;
	const globalRatios = options.ratios ?? [...DEFAULT_RATIOS];
	const formula: ContrastFormula = options.formula ?? "wcag2";
	const saturation = options.saturation ?? 100;

	const theme: Theme = {};

	for (const [modeName, modeConfig] of Object.entries(modes)) {
		const resolved = resolveModeConfig(modeName, modeConfig);
		const neutralColor = basePalettes.get("neutral")!;
		const background = getBackgroundFromNeutral(neutralColor, resolved.lightness);

		// Call generateTheme for this mode
		// Include ALL palettes (including neutral) in colors array
		const generated = generateTheme({
			colors: [...basePalettes.entries()].map(([name, color]) => ({
				name,
				colorKeys: [resolved.palettes[name]?.color ?? color],
				ratios: resolved.palettes[name]?.ratios ?? globalRatios,
			})),
			backgroundColor: background,
			lightness: resolved.lightness,
			saturation,
			contrast: 1,
			formula,
		});

		// Map output to ColorScale format
		const scales: Record<string, ColorScale> = {};
		for (const [name, values] of Object.entries(generated.colors)) {
			scales[name] = mapToColorScale(values);
		}

		theme[modeName] = { scales };
	}

	return theme;
}
