/**
 * Contrast theme orchestrator.
 *
 * Builds the per-mode background from the neutral seed, then runs the registered
 * `contrast` producer (OKLCH contrast-target solver) once per palette per mode.
 * Keeps the `{ palettes, modes }` options shape; the heavy color math lives in
 * the producer + solver, not here.
 */

import type { z } from "zod";

import "../producers"; // side-effect: register built-in producers
import { getProducer, type ModeCtx } from "../producer";
import { gamutMap, oklchCss, toOklch } from "../shared/color";
import { DEFAULT_MODES, SCALE_STEPS, SEMANTIC_COLORS } from "../shared/constants";
import { defaultRatios } from "./solver";

import type { ContrastFormula } from "../shared/on-color";
import type { ColorScale, Theme } from "../shared/types";
import type { createContrastThemeOptionsSchema, modeSchema } from "./schema";

export type CreateContrastThemeOptions = z.infer<typeof createContrastThemeOptionsSchema>;
type Mode = z.infer<typeof modeSchema>;

interface ResolvedMode {
	isDark: boolean;
	/** Background lightness in OKLCH L (0..1). */
	bgLightness: number;
	palettes: Record<string, { color?: string; ratios?: number[] }>;
}

function resolveMode(name: string, config: Mode): ResolvedMode {
	const isDark = name.toLowerCase().includes("dark");
	const defaultBgL = isDark ? 0.16 : 0.98;
	if (config === true) {
		return { isDark, bgLightness: defaultBgL, palettes: {} };
	}
	return {
		isDark,
		bgLightness: config.lightness != null ? config.lightness / 100 : defaultBgL,
		palettes: config.palettes ?? {},
	};
}

/** primary (required) + neutral (explicit, else derived from primary) + semantic/custom palettes. */
function buildBasePalettes(palettes: CreateContrastThemeOptions["palettes"]): Map<string, string> {
	const result = new Map<string, string>();
	result.set("primary", palettes.primary);
	result.set("neutral", palettes.neutral ?? palettes.primary);
	for (const [name, value] of Object.entries(palettes)) {
		if (name === "primary" || name === "neutral") continue;
		if (value === true) {
			const def = SEMANTIC_COLORS[name];
			if (def) result.set(name, def);
		} else if (typeof value === "string") {
			result.set(name, value);
		}
	}
	return result;
}

/** Derive the mode background from the neutral seed at the mode's lightness anchor (lightly tinted). */
function deriveBackground(neutralSeed: string, bgLightness: number): string {
	const { c, h } = toOklch(neutralSeed);
	return oklchCss(gamutMap({ l: bgLightness, c: Math.min(c, 0.01), h }));
}

/**
 * Create a contrast theme: OKLCH ramps solved to per-step target contrasts
 * against each mode's background, with paired on-* foregrounds.
 */
export function createContrastTheme(options: CreateContrastThemeOptions): Theme {
	const basePalettes = buildBasePalettes(options.palettes);
	const modes = options.modes ?? DEFAULT_MODES;
	const globalRatios = options.ratios;
	const formula: ContrastFormula = options.formula === "wcag3" ? "apca" : "wcag2";
	const chroma = (options.saturation ?? 100) / 100;
	// Global ratios drive the scale shape: their count defines the number of steps.
	// 11 ratios keep the familiar 50–950 names; any other count uses numeric step labels.
	const steps =
		globalRatios && globalRatios.length !== SCALE_STEPS.length
			? Array.from({ length: globalRatios.length }, (_, i) => String(i + 1))
			: [...SCALE_STEPS];
	const producer = getProducer("contrast");

	const theme: Theme = {};
	for (const [modeName, modeConfig] of Object.entries(modes)) {
		const resolved = resolveMode(modeName, modeConfig);
		const neutralSeed = resolved.palettes.neutral?.color ?? basePalettes.get("neutral")!;
		const background = deriveBackground(neutralSeed, resolved.bgLightness);
		const ctx: ModeCtx = { name: modeName, isDark: resolved.isDark, steps, background };

		const scales: Record<string, ColorScale> = {};
		const on: Record<string, ColorScale> = {};
		for (const [name, baseSeed] of basePalettes) {
			const override = resolved.palettes[name];
			const out = producer.produce(
				{
					seed: override?.color ?? baseSeed,
					ratios: override?.ratios ?? globalRatios ?? defaultRatios(steps.length, formula),
					formula,
					chroma,
					neutral: name === "neutral",
				},
				ctx,
			);
			scales[name] = out.scale;
			on[name] = out.on;
		}
		theme[modeName] = { scales, on };
	}
	return theme;
}
