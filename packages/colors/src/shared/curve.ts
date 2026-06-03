/**
 * Algorithm-general curve utilities shared by producers (no producer imports
 * another producer's internals).
 */

/**
 * Evil Martians perceptual lightness anchors for an 11-step ramp (OKLCH L, 0..1),
 * light → dark. The light end is compressed, mid→dark wider. Background-independent.
 */
export const L_ANCHORS = [
	0.9778, 0.9356, 0.8811, 0.8267, 0.7422, 0.6478, 0.5733, 0.4689, 0.3944, 0.32, 0.2378,
] as const;

/** Linearly resample an anchor array to `n` points (n >= 1). */
export function resample(anchors: readonly number[], n: number): number[] {
	if (n <= 1) return [anchors[anchors.length - 1]!];
	if (n === anchors.length) return [...anchors];
	const out: number[] = [];
	const last = anchors.length - 1;
	for (let i = 0; i < n; i++) {
		const t = (i / (n - 1)) * last;
		const lo = Math.floor(t);
		const hi = Math.min(lo + 1, last);
		const f = t - lo;
		out.push(anchors[lo]! * (1 - f) + anchors[hi]! * f);
	}
	return out;
}

/** Default per-step lightness for `n` steps (resampled EM anchors). */
export function lightnessForSteps(n: number): number[] {
	return resample(L_ANCHORS, n);
}

/** Mid-peak chroma multiplier per step: peaks 1.0 at center, tapers to ~0.45 at both ends. */
export function chromaEnvelope(i: number, n: number): number {
	if (n <= 1) return 1;
	return 0.45 + 0.55 * Math.sin(Math.PI * (i / (n - 1)));
}
