/**
 * Presets — additional ids that reuse a base producer with preset knobs.
 * Proves the registry-extensibility claim (one registerProducer per preset).
 */

import { type OklchOpts, oklchProducer } from "./oklch";

import type { ColorProducer } from "../producer";

/** Tailwind-style: the OKLCH producer with hue-torsion on (warm→orange / cool→violet at the dark end). */
export const tailwindProducer: ColorProducer<OklchOpts> = {
	id: "tailwind",
	schema: oklchProducer.schema,
	produce: (opts, ctx) => oklchProducer.produce({ ...opts, hueTorsion: opts.hueTorsion ?? 24 }, ctx),
};
