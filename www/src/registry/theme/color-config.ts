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

export interface ColorConfig {
	algorithm: AlgorithmId;
	/** Scale step names; defaults to the kernel's `50`..`950`. */
	steps?: string[];
	seeds: PaletteSeeds;
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
