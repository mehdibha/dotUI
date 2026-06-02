/**
 * Built-in color producers. Importing this module registers them.
 *
 * Phase 0 ships the default `contrast` (OKLCH contrast-target) and `fixed`
 * (identity) producers. `oklch` (perceptual curve) and `material` (wrapped HCT)
 * land in follow-ups; adding one is a single `registerProducer` call here.
 *
 * `fixed` is reachable today only via the registry (used by tests + the Phase 1
 * ColorConfig path), not yet through `createTheme`'s discriminated union.
 * Each producer's `schema` is the contract validated at the ColorConfig boundary
 * in Phase 1; the orchestrator currently builds typed opts directly.
 */

import { z } from "zod";

import { defaultRatios, solveRamp } from "./contrast/solver";
import { type ModeCtx, type PaletteOutput, registerProducer } from "./producer";
import { gamutMap, oklchCss, toOklch } from "./shared/color";
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
		const formula = opts.formula ?? "wcag2";
		// Use the supplied targets as-is (solveRamp tolerates length mismatch); never silently drop them.
		const ratios = opts.ratios ?? defaultRatios(ctx.steps.length, formula);
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
			if (value != null) scale[step] = oklchCss(gamutMap(toOklch(value)));
		}
		return { scale, on: computeOnColors(scale, "wcag2") };
	},
});
