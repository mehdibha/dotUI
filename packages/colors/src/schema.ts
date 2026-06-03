/**
 * Top-level `createTheme` options — a discriminated union over algorithm.
 * `oklch` is the conceptual default (see `createTheme`).
 */

import { z } from "zod";

/** Generative palettes: `primary` required (seed); others = seed string or on/off; custom names allowed. */
const generativePalettes = z.object({ primary: z.string() }).catchall(z.union([z.string(), z.boolean()]));

const paletteOverride = z.object({
	seed: z.string().optional(),
	ratios: z.array(z.number().positive()).min(2).optional(),
	tones: z.array(z.number().min(0).max(100)).min(2).optional(),
});

const modeSchema = z.union([
	z.literal(true),
	z.object({
		isDark: z.boolean().optional(),
		/** Background OKLCH lightness (0..1); defaults by isDark. */
		lightness: z.number().min(0).max(1).optional(),
		palettes: z.record(z.string(), paletteOverride).optional(),
	}),
]);

const modesSchema = z.record(z.string(), modeSchema).optional();
const stepsSchema = z.array(z.string()).min(2).optional();

const oklchArm = z.object({
	algorithm: z.literal("oklch"),
	palettes: generativePalettes,
	modes: modesSchema,
	steps: stepsSchema,
	chromaMult: z.number().min(0).optional(),
	minChroma: z.number().min(0).optional(),
	hueTorsion: z.number().optional(),
	chromaMode: z.enum(["consistent", "max"]).optional(),
	preserveSeedAt: z.string().optional(),
});

const tailwindArm = oklchArm.extend({ algorithm: z.literal("tailwind") });

const contrastArm = z.object({
	algorithm: z.literal("contrast"),
	palettes: generativePalettes,
	modes: modesSchema,
	steps: stepsSchema,
	ratios: z.array(z.number().positive()).min(2).optional(),
	formula: z.enum(["wcag2", "apca"]).optional(),
	saturation: z.number().min(0).max(100).optional(),
});

const materialArm = z.object({
	algorithm: z.literal("material"),
	palettes: generativePalettes,
	modes: modesSchema,
	steps: stepsSchema,
	tones: z.array(z.number().min(0).max(100)).min(2).optional(),
});

const fixedArm = z.object({
	algorithm: z.literal("fixed"),
	/** Fixed palettes: each is a literal step→color ramp. */
	palettes: z.record(z.string(), z.record(z.string(), z.string())),
	modes: modesSchema,
	steps: stepsSchema,
});

export const createThemeOptionsSchema = z.discriminatedUnion("algorithm", [
	oklchArm,
	tailwindArm,
	contrastArm,
	materialArm,
	fixedArm,
]);

export type CreateThemeOptions = z.infer<typeof createThemeOptionsSchema>;
