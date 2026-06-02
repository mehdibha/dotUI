/**
 * Built-in color producers. Importing this module registers them.
 *
 * Phase 0 ships the default `contrast` (OKLCH contrast-target) and `fixed`
 * (identity) producers. `oklch` (perceptual curve) and `material` (wrapped HCT)
 * land in follow-ups; adding one is a single `registerProducer` call here.
 */

import { z } from "zod";

import { defaultRatios, solveRamp } from "./contrast/solver";
import { type ModeCtx, type PaletteOutput, registerProducer } from "./producer";
import { oklchCss, toOklch } from "./shared/color";
import { computeOnColors } from "./shared/on-color";

// ---- contrast (default): OKLCH contrast-target solver ----

const contrastSchema = z.object({
	seed: z.string(),
	ratios: z.array(z.number().positive()).optional(),
	formula: z.enum(["wcag2", "apca"]).optional(),
	chroma: z.number().min(0).max(2).optional(),
	neutral: z.boolean().optional(),
});
type ContrastOpts = z.infer<typeof contrastSchema>;

registerProducer({
	id: "contrast",
	schema: contrastSchema,
	produce(opts: ContrastOpts, ctx: ModeCtx): PaletteOutput {
		const ratios = opts.ratios?.length === ctx.steps.length ? opts.ratios : defaultRatios(ctx.steps.length);
		const formula = opts.formula ?? "wcag2";
		const scale = solveRamp(
			{ seed: opts.seed, ratios, formula, chroma: opts.chroma ?? 1, neutral: opts.neutral ?? false },
			ctx,
		);
		return { scale, on: computeOnColors(scale, formula) };
	},
});

// ---- fixed: identity producer (hand-authored ramps == generated ramps, one path) ----

const fixedSchema = z.object({ scale: z.record(z.string(), z.string()) });
type FixedOpts = z.infer<typeof fixedSchema>;

registerProducer({
	id: "fixed",
	schema: fixedSchema,
	produce(opts: FixedOpts, ctx: ModeCtx): PaletteOutput {
		// Honor the supplied values (normalized to oklch() for a uniform output contract).
		const scale: Record<string, string> = {};
		for (const step of ctx.steps) {
			const value = opts.scale[step];
			if (value != null) scale[step] = oklchCss(toOklch(value));
		}
		return { scale, on: computeOnColors(scale, "wcag2") };
	},
});
