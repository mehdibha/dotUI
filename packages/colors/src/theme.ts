/**
 * The one generalized, registry-driven, background-independent orchestrator.
 *
 * Resolves palettes (primary required; neutral explicit-or-derived; status via
 * SEMANTIC_COLORS; custom catchall) and modes once, derives each mode's
 * background from the neutral seed, then loops modes × palettes calling the
 * registered producer. No per-algorithm branching.
 */

import { type ModeCtx, produceValidated } from "./producer";
import { registerBuiltins } from "./producers";
import { type CreateThemeOptions, createThemeOptionsSchema } from "./schema";
import { gamutMap, oklchCss, toOklch } from "./shared/color";
import { DEFAULT_MODES, SCALE_STEPS, SEMANTIC_COLORS } from "./shared/constants";

import type { ColorScale, Theme } from "./shared/types";

type AnyRecord = Record<string, unknown>;

interface ResolvedMode {
	isDark: boolean;
	bgLightness: number;
	palettes: Record<string, { seed?: string; ratios?: number[]; tones?: number[] }>;
}

/** Resolve the per-palette base inputs: name → seed string (generative) or scale map (fixed). */
function resolvePalettes(palettes: AnyRecord, isFixed: boolean): Map<string, string | ColorScale> {
	const out = new Map<string, string | ColorScale>();
	if (isFixed) {
		for (const [name, scale] of Object.entries(palettes)) out.set(name, scale as ColorScale);
		return out;
	}
	const primary = palettes.primary as string;
	out.set("primary", primary);
	out.set("neutral", (palettes.neutral as string | undefined) ?? primary);
	for (const [name, value] of Object.entries(palettes)) {
		if (name === "primary" || name === "neutral") continue;
		if (value === true) {
			const def = SEMANTIC_COLORS[name];
			if (def) out.set(name, def);
		} else if (typeof value === "string") {
			out.set(name, value);
		}
	}
	return out;
}

function resolveMode(name: string, config: unknown): ResolvedMode {
	const isDarkByName = name.toLowerCase().includes("dark");
	if (config === true || config == null) {
		return { isDark: isDarkByName, bgLightness: isDarkByName ? 0.16 : 0.98, palettes: {} };
	}
	const c = config as { isDark?: boolean; lightness?: number; palettes?: ResolvedMode["palettes"] };
	const isDark = c.isDark ?? isDarkByName;
	return {
		isDark,
		bgLightness: c.lightness ?? (isDark ? 0.16 : 0.98),
		palettes: c.palettes ?? {},
	};
}

/** Mode background from the neutral seed at the mode's lightness anchor (lightly tinted). */
function deriveBackground(neutralSeed: string | undefined, bgLightness: number): string {
	if (!neutralSeed) return oklchCss({ l: bgLightness, c: 0, h: 0 });
	const { c, h } = toOklch(neutralSeed);
	return oklchCss(gamutMap({ l: bgLightness, c: Math.min(c, 0.01), h }));
}

/** Build a superset opts object; each producer's schema strips it to its own fields. */
function buildPaletteOpts(
	name: string,
	input: string | ColorScale,
	knobs: AnyRecord,
	override: ResolvedMode["palettes"][string] | undefined,
): AnyRecord {
	const seed = override?.seed ?? (typeof input === "string" ? input : undefined);
	const saturation = knobs.saturation as number | undefined;
	return {
		seed,
		neutral: name === "neutral",
		scale: typeof input === "object" ? input : undefined,
		// contrast
		ratios: override?.ratios ?? (knobs.ratios as number[] | undefined),
		formula: knobs.formula,
		chroma: saturation != null ? saturation / 100 : undefined,
		// material
		tones: override?.tones ?? (knobs.tones as number[] | undefined),
		// oklch / tailwind
		chromaMult: knobs.chromaMult,
		minChroma: knobs.minChroma,
		hueTorsion: knobs.hueTorsion,
		chromaMode: knobs.chromaMode,
		preserveSeedAt: knobs.preserveSeedAt,
	};
}

/**
 * Create a theme. `algorithm` selects the producer (oklch is the recommended default).
 * Output: `Theme` — primitive ramps + paired on-* per palette, per mode.
 */
export function createTheme(options: CreateThemeOptions): Theme {
	registerBuiltins();
	const opts = createThemeOptionsSchema.parse(options);
	const knobs = opts as AnyRecord;
	const { algorithm } = opts;
	const steps = (opts.steps as string[] | undefined) ?? [...SCALE_STEPS];
	const modes = (opts.modes as Record<string, unknown> | undefined) ?? DEFAULT_MODES;
	const isFixed = algorithm === "fixed";

	const baseInputs = resolvePalettes(opts.palettes as AnyRecord, isFixed);
	const neutralBase = isFixed ? undefined : (baseInputs.get("neutral") as string | undefined);

	const theme: Theme = {};
	for (const [modeName, modeConfig] of Object.entries(modes)) {
		const resolved = resolveMode(modeName, modeConfig);
		const neutralSeed = resolved.palettes.neutral?.seed ?? neutralBase;
		const ctx: ModeCtx = {
			name: modeName,
			isDark: resolved.isDark,
			steps,
			background: deriveBackground(neutralSeed, resolved.bgLightness),
		};
		const scales: Record<string, ColorScale> = {};
		const on: Record<string, ColorScale> = {};
		for (const [name, input] of baseInputs) {
			const paletteOpts = buildPaletteOpts(name, input, knobs, resolved.palettes[name]);
			const out = produceValidated(algorithm, paletteOpts, ctx);
			scales[name] = out.scale;
			on[name] = out.on;
		}
		theme[modeName] = { scales, on };
	}
	return theme;
}
