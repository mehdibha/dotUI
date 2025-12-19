import { argbFromRgb, Hct, hexFromArgb, TonalPalette } from "@material/material-color-utilities";
import Color from "colorjs.io";

import { SCALE_STEPS, SEMANTIC_COLORS } from "../shared/constants";
import {
	DEFAULT_CONTRAST,
	DEFAULT_DARK_TONES,
	DEFAULT_LIGHT_TONES,
	DEFAULT_VARIANT,
	NEUTRAL_CHROMA,
} from "./constants";
import type { ColorScale, Theme } from "../shared/types";
import type { CreateThemeOptions, Mode, ResolvedModeConfig } from "./types";

export { createMaterialThemeOptionsSchema } from "./schema";
export type { ColorScale, Theme, ThemeMode } from "../shared/types";
export type { CreateThemeOptions } from "./types";

// ============================================================================
// Helpers
// ============================================================================

/**
 * Parse any color string to HCT
 */
function parseColorToHct(color: string): Hct {
	const { r, g, b } = new Color(color).srgb as unknown as { r: number; g: number; b: number };
	return Hct.fromInt(argbFromRgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)));
}

/**
 * Create TonalPalette from color string
 */
function createPalette(color: string): TonalPalette {
	const { hue, chroma } = parseColorToHct(color);
	return TonalPalette.fromHueAndChroma(hue, chroma);
}

const DEFAULT_MODES = {
	light: { isDark: false },
	dark: { isDark: true },
} as const;

/**
 * Generate ColorScale from TonalPalette + tones
 */
function generateColorScale(palette: TonalPalette, tones: number[]): ColorScale {
	return Object.fromEntries(SCALE_STEPS.map((step, i) => [step, hexFromArgb(palette.tone(tones[i]!))])) as ColorScale;
}

/**
 * Resolve mode config with defaults
 */
function resolveModeConfig(name: string, config: Mode): ResolvedModeConfig {
	if (config === true) {
		const isDark = name.toLowerCase().includes("dark");
		return {
			isDark,
			variant: DEFAULT_VARIANT,
			contrast: DEFAULT_CONTRAST,
			tones: isDark ? DEFAULT_DARK_TONES : DEFAULT_LIGHT_TONES,
			palettes: {},
		};
	}

	return {
		isDark: config.isDark,
		variant: config.variant ?? DEFAULT_VARIANT,
		contrast: config.contrast ?? DEFAULT_CONTRAST,
		tones: config.isDark ? DEFAULT_DARK_TONES : DEFAULT_LIGHT_TONES,
		palettes: config.palettes ?? {},
	};
}

/**
 * Build base palettes from global config
 */
function buildBasePalettes(palettes: CreateThemeOptions["palettes"]): Map<string, TonalPalette> {
	const result = new Map<string, TonalPalette>();

	// Primary (required)
	const primaryHct = parseColorToHct(palettes.primary);
	result.set("primary", createPalette(palettes.primary));

	// Neutral - from provided color or derive from primary
	if (palettes.neutral) {
		result.set("neutral", createPalette(palettes.neutral));
	} else {
		result.set("neutral", TonalPalette.fromHueAndChroma(primaryHct.hue, NEUTRAL_CHROMA));
	}

	// Semantic and custom palettes
	for (const [name, value] of Object.entries(palettes)) {
		if (name === "primary" || name === "neutral") continue;

		if (value === true) {
			const defaultColor = SEMANTIC_COLORS[name];
			if (defaultColor) result.set(name, createPalette(defaultColor));
		} else if (typeof value === "string") {
			result.set(name, createPalette(value));
		}
	}

	return result;
}

// ============================================================================
// Main Export
// ============================================================================

/**
 * Create a Material theme
 *
 * @example
 * ```ts
 * const theme = createMaterialTheme({
 *   palettes: {
 *     primary: "#6366f1",
 *     success: true,
 *   },
 *   modes: {
 *     light: { isDark: false },
 *     dark: { isDark: true },
 *   },
 * });
 * ```
 */
export function createMaterialTheme(options: CreateThemeOptions): Theme {
	const basePalettes = buildBasePalettes(options.palettes);
	const modes: Record<string, Mode> = options.modes ?? DEFAULT_MODES;
	const theme: Theme = {};

	for (const [modeName, modeConfig] of Object.entries(modes)) {
		const resolved = resolveModeConfig(modeName, modeConfig);
		const scales: Record<string, ColorScale> = {};

		for (const [paletteName, basePalette] of basePalettes) {
			const override = resolved.palettes[paletteName];
			const palette = override?.color ? createPalette(override.color) : basePalette;
			const tones = override?.tones ?? resolved.tones;
			scales[paletteName] = generateColorScale(palette, tones);
		}

		theme[modeName] = { scales };
	}

	return theme;
}
