/**
 * Fixed (identity) producer — hand-authored ramps == generated ramps, one path.
 * Honors the supplied values, normalized to in-gamut oklch() for a uniform output contract.
 */

import { z } from "zod";

import { gamutMap, oklchCss, toOklch } from "../shared/color";
import { computeOnColors } from "../shared/on-color";

import type { ColorProducer } from "../producer";

export const fixedOptsSchema = z.object({ scale: z.record(z.string(), z.string()) });
export type FixedOpts = z.infer<typeof fixedOptsSchema>;

export const fixedProducer: ColorProducer<FixedOpts> = {
	id: "fixed",
	schema: fixedOptsSchema,
	produce(opts, ctx) {
		const scale: Record<string, string> = {};
		for (const step of ctx.steps) {
			const value = opts.scale[step];
			if (value != null) scale[step] = oklchCss(gamutMap(toOklch(value)));
		}
		return { scale, on: computeOnColors(scale) };
	},
};
