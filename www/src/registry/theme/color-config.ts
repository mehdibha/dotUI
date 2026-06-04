/**
 * `ColorConfig` — the recipe that generates dotUI's primitive ramps.
 *
 * Stores seeds + the algorithm, never expanded ramps: `resolveColorConfig`
 * (in `primitives.ts`) feeds these to the `@dotui/colors` kernel to produce the
 * per-mode `--neutral-*` / `--accent-*` / status ramps emitted into `colors.css`.
 */

/** Producers offered by the `@dotui/colors` kernel. `oklch` is the default. */
export type AlgorithmId = "oklch" | "tailwind" | "contrast" | "material" | "fixed";

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
		accent: "hsl(210 64% 55%)",
		success: "#22c55e",
		warning: "#eab308",
		danger: "#ef4444",
		info: "hsl(210 64% 55%)",
	},
};
