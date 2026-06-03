/**
 * Material 3 HCT producer (§4.6, "should") — registered, emitting oklch().
 *
 * Wraps @material/material-color-utilities tone math, but routes all I/O through
 * the shared colorjs.io seam (no direct colorjs.io / hex output) and honors
 * arbitrary `ctx.steps` by resampling the tone set. Carries on-* like every producer.
 */

import { argbFromRgb, Hct, hexFromArgb, TonalPalette } from "@material/material-color-utilities";
import { z } from "zod";

import { gamutMap, oklchCss, toOklch, toSrgb } from "../shared/color";
import { resample } from "../shared/curve";
import { computeOnColors } from "../shared/on-color";

import type { ColorProducer } from "../producer";

const LIGHT_TONES = [99, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10];
const DARK_TONES = [10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 95];
const NEUTRAL_CHROMA = 6;

export const materialOptsSchema = z.object({
	seed: z.string(),
	tones: z.array(z.number().min(0).max(100)).min(2).optional(),
	neutral: z.boolean().optional(),
});
export type MaterialOpts = z.infer<typeof materialOptsSchema>;

function tonalPalette(seed: string, neutral: boolean): TonalPalette {
	const { r, g, b } = toSrgb(seed);
	const hct = Hct.fromInt(argbFromRgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)));
	return TonalPalette.fromHueAndChroma(hct.hue, neutral ? NEUTRAL_CHROMA : hct.chroma);
}

export const materialProducer: ColorProducer<MaterialOpts> = {
	id: "material",
	schema: materialOptsSchema,
	produce(opts, ctx) {
		const palette = tonalPalette(opts.seed, opts.neutral ?? false);
		const tones = resample(opts.tones ?? (ctx.isDark ? DARK_TONES : LIGHT_TONES), ctx.steps.length);
		const scale: Record<string, string> = {};
		for (let i = 0; i < ctx.steps.length; i++) {
			const hex = hexFromArgb(palette.tone(tones[i]!));
			scale[ctx.steps[i]!] = oklchCss(gamutMap(toOklch(hex)));
		}
		return { scale, on: computeOnColors(scale) };
	},
};
