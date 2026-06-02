/**
 * Pluggable color-producer registry.
 *
 * Every generation strategy (contrast-target, oklch-curve, material, fixed, …)
 * implements {@link ColorProducer} and registers itself. Adding an algorithm is
 * one `registerProducer` call — nothing downstream branches on the algorithm.
 * `createTheme` resolves a producer by id and calls `produce` once per palette
 * per mode.
 */

import type { ZodType } from "zod";

import type { ColorScale } from "./shared/types";

/** Identifier for a registered generation algorithm. `fixed` is the identity producer. */
export type AlgorithmId = "contrast" | "oklch" | "material" | "fixed";

/** Per-mode context handed to a producer for one `produce` call. */
export interface ModeCtx {
	/** Mode name, e.g. "light" | "dark" | "hc-dark". */
	name: string;
	/** Whether this mode is dark — controls ramp lightness direction and on-* polarity. */
	isDark: boolean;
	/** Ordered step names defining the scale shape (e.g. ["50",…,"950"] or ["1",…,"12"]). */
	steps: readonly string[];
	/**
	 * The mode's background color (any CSS color string). Contrast-targeting
	 * producers solve each step's contrast against this; it is derived from the
	 * neutral palette before palettes are produced.
	 */
	background: string;
}

/** A produced palette: the ramp plus its paired on-* foregrounds, both keyed by step. */
export interface PaletteOutput {
	/** The color ramp, keyed by step name. */
	scale: ColorScale;
	/** Readable foreground for each step (same keys as `scale`). */
	on: ColorScale;
}

/**
 * A generation strategy. `produce` must be pure and deterministic: the same
 * `(opts, ctx)` always yields the same output (so results cache by preset).
 */
export interface ColorProducer<Opts = unknown> {
	id: AlgorithmId;
	/** Validates this producer's per-palette options (restores per-algorithm refinements). */
	schema: ZodType<Opts>;
	/** Produce one palette's ramp + on-* for a single mode. */
	produce(opts: Opts, ctx: ModeCtx): PaletteOutput;
}

// oxlint-disable-next-line typescript/no-explicit-any -- the registry is heterogeneous by design.
const registry = new Map<AlgorithmId, ColorProducer<any>>();

/** Register (or replace) a producer. Idempotent per id. */
// oxlint-disable-next-line typescript/no-explicit-any -- stored type-erased; callers pass concrete producers.
export function registerProducer(producer: ColorProducer<any>): void {
	registry.set(producer.id, producer);
}

/** Resolve a producer by id, throwing a helpful error if it isn't registered. */
// oxlint-disable-next-line typescript/no-explicit-any -- see registry above.
export function getProducer(id: AlgorithmId): ColorProducer<any> {
	const producer = registry.get(id);
	if (!producer) {
		const known = [...registry.keys()].join(", ") || "none";
		throw new Error(`Unknown color algorithm "${id}". Registered producers: ${known}.`);
	}
	return producer;
}

/** Whether a producer is registered for `id`. */
export function hasProducer(id: AlgorithmId): boolean {
	return registry.has(id);
}
