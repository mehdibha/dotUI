/**
 * `ColorConfig` — the recipe that generates dotUI's primitive ramps.
 *
 * Stores seeds + the algorithm, never expanded ramps: `resolveColorConfig`
 * (in `primitives.ts`) feeds these to the `@dotui/colors` kernel to produce the
 * per-mode `--neutral-*` / `--accent-*` / status ramps emitted into `colors.css`.
 */

import { SEMANTIC_COLORS } from "@dotui/colors";

/**
 * Seed-generative producers offered by the `@dotui/colors` kernel. `oklch` is the
 * default. The kernel also has a `fixed` producer (hand-authored literal ramps), but
 * it is intentionally excluded: a `ColorConfig` carries seeds, not ramps, so feeding it
 * to `fixed` would throw. Keep this list in sync with the customizer's algorithm Select.
 */
export const GENERATIVE_ALGORITHMS = ["oklch", "tailwind", "contrast", "material"] as const;
export type AlgorithmId = (typeof GENERATIVE_ALGORITHMS)[number];

export interface PaletteSeeds {
	/** The required neutral backbone (surfaces, text, borders). */
	neutral: string;
	/** The brand accent — mapped to the kernel's `primary` palette. */
	accent: string;
	success?: string;
	warning?: string;
	danger?: string;
	info?: string;
}

/**
 * Per-producer tuning knobs, all optional. `resolveColorConfig` spreads them into the
 * kernel's `createTheme`; each producer's schema keeps only the knobs it understands.
 * Kept ABSENT from {@link DEFAULT_COLOR_CONFIG} so an untouched palette still encodes to
 * `undefined` (the codec diffs the whole recipe against the default).
 */
export interface ColorKnobs {
	/** oklch / tailwind: multiplier on the seed's chroma (1 = the seed's own chroma). */
	chromaMult?: number;
	/** oklch / tailwind: peak-chroma floor so muted seeds still yield a usable accent. */
	minChroma?: number;
	/** oklch / tailwind: degrees of hue drift toward the dark end (0 = constant hue). */
	hueTorsion?: number;
	/** oklch / tailwind: envelope-tapered (default) or pushed to the gamut cusp (vivid). */
	chromaMode?: "consistent" | "max";
	/** oklch / tailwind: pin the exact seed lightness at this step. */
	preserveSeedAt?: string;
	/** contrast: WCAG 2 or APCA contrast targeting. */
	formula?: "wcag2" | "apca";
	/** contrast: chroma expressed as 0–100 saturation (the kernel maps it to chroma). */
	saturation?: number;
	/** contrast: per-step target contrast ratios. */
	ratios?: number[];
	/** material: per-step tones (0–100). */
	tones?: number[];
}

export interface ColorConfig {
	algorithm: AlgorithmId;
	/** Scale step names; defaults to the kernel's `50`..`950`. */
	steps?: string[];
	seeds: PaletteSeeds;
	/** Optional per-producer tuning; absent for the default palette. */
	knobs?: ColorKnobs;
}

/**
 * dotUI's default generated palette: a neutral-gray backbone, a blue brand
 * accent (the legacy `--accent` hue), and standard status hues. Perceptual
 * OKLCH ramps, background-independent; dark mode mirrors the lightness ladder.
 */
export const DEFAULT_COLOR_CONFIG: ColorConfig = {
	algorithm: "oklch",
	seeds: {
		neutral: "#808080",
		accent: "#438cd6",
		// Status seeds come from the kernel's single source so the two never drift.
		success: SEMANTIC_COLORS.success,
		warning: SEMANTIC_COLORS.warning,
		danger: SEMANTIC_COLORS.danger,
		info: SEMANTIC_COLORS.info,
	},
};
