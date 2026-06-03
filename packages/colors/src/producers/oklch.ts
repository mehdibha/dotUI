/**
 * OKLCH-perceptual producer — the DEFAULT (§4.2).
 *
 * Fixed seed hue + a fixed perceptual lightness array (Evil Martians anchors,
 * resampled for arbitrary N) + a mid-peak tapered chroma scaled by the seed's
 * chroma (with a min-chroma floor so muted seeds still yield a usable accent),
 * gamut-mapped to sRGB. Background-INDEPENDENT and mode-agnostic; emits oklch().
 */

import { z } from "zod";

import { gamutMap, oklchCss, toOklch } from "../shared/color";
import { chromaEnvelope, lightnessForSteps } from "../shared/curve";
import { computeOnColors } from "../shared/on-color";
import { applyAnchoring } from "../shared/seed-anchor";

import type { ColorProducer } from "../producer";

export const oklchOptsSchema = z.object({
	seed: z.string(),
	/** Multiplier on the seed's chroma (1 = use the seed's chroma). */
	chromaMult: z.number().min(0).optional(),
	/** Peak-chroma floor for colored palettes so muted seeds still produce a usable accent. */
	minChroma: z.number().min(0).optional(),
	/** Near-zero chroma backbone (the neutral palette). */
	neutral: z.boolean().optional(),
	/** Degrees of hue drift toward the dark end (warm→orange / cool→violet). 0 = constant hue. */
	hueTorsion: z.number().optional(),
	/** "consistent" (envelope-tapered, default) or "max" (push to the gamut cusp per step — vivid). */
	chromaMode: z.enum(["consistent", "max"]).optional(),
	/** Pin the exact seed lightness at this step (default: off → array-driven). */
	preserveSeedAt: z.string().optional(),
});
export type OklchOpts = z.infer<typeof oklchOptsSchema>;

const NEUTRAL_MAX_C = 0.012;
const DEFAULT_MIN_PEAK_C = 0.11;
const MAX_MODE_C = 0.4;

/** Anchor-relative hue torsion: warm hues drift toward orange (~50°), cool toward violet (~290°), at the dark end. */
function torsion(hue: number, t: number, amount: number): number {
	if (amount === 0) return hue;
	const target = hue >= 20 && hue <= 110 ? 50 : hue >= 200 && hue <= 290 ? 290 : null;
	if (target === null) return hue;
	const delta = target - hue;
	// Move toward the anchor, never past it.
	return hue + Math.sign(delta) * Math.min(Math.abs(delta), amount * t);
}

export const oklchProducer: ColorProducer<OklchOpts> = {
	id: "oklch",
	schema: oklchOptsSchema,
	produce(opts, ctx) {
		const seed = toOklch(opts.seed);
		const n = ctx.steps.length;
		const ls = applyAnchoring(lightnessForSteps(n), ctx.steps, seed.l, opts.preserveSeedAt);
		const neutral = opts.neutral ?? false;
		const peakC = neutral
			? Math.min(seed.c, NEUTRAL_MAX_C)
			: Math.max(seed.c * (opts.chromaMult ?? 1), opts.minChroma ?? DEFAULT_MIN_PEAK_C);
		const torsionAmt = opts.hueTorsion ?? 0;
		const maxMode = opts.chromaMode === "max" && !neutral;

		const scale: Record<string, string> = {};
		for (let i = 0; i < n; i++) {
			const t = n <= 1 ? 0 : i / (n - 1);
			const h = torsion(seed.h, t, torsionAmt);
			const c = maxMode ? MAX_MODE_C : peakC * chromaEnvelope(i, n);
			scale[ctx.steps[i]!] = oklchCss(gamutMap({ l: ls[i]!, c, h }));
		}
		return { scale, on: computeOnColors(scale) };
	},
};
