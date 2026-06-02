/**
 * OKLCH contrast-target solver — the core of the default `contrast` algorithm.
 *
 * A ramp is a list of (step → target contrast) pairs. For each step we fix the
 * seed hue, pick a tapered chroma, and binary-search OKLCH lightness for the
 * color whose contrast against the mode background hits the target — gamut-
 * mapping every probe. This gives accessibility + arbitrary step count + on-*
 * (same solver, the on-* helper) by construction, and emits `oklch()` natively.
 *
 * Replaces the old 3000-swatch Leonardo scale-build; pure and deterministic.
 */

import { apca, gamutMap, oklchCss, toOklch, wcag2, type Oklch } from "../shared/color";

import type { ModeCtx } from "../producer";
import type { ContrastFormula } from "../shared/on-color";
import type { ColorScale } from "../shared/types";

/**
 * Anchor curves for an 11-step ramp. WCAG2 = contrast ratios (1–21); APCA = Lc
 * values (0–~108) kept above the ~Lc 8 "platform" floor below which APCA reports
 * a flat 0 — so the lower ramp doesn't collapse into that dead zone.
 */
const WCAG2_ANCHORS = [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15] as const;
const APCA_ANCHORS = [10, 15, 22, 30, 42, 55, 68, 80, 90, 100, 106] as const;

function resample(anchors: readonly number[], n: number): number[] {
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

/** Default per-step targets for any N, resampled from the formula's anchor curve. */
export function defaultRatios(n: number, formula: ContrastFormula = "wcag2"): number[] {
	return resample(formula === "apca" ? APCA_ANCHORS : WCAG2_ANCHORS, n);
}

/** Chroma multiplier per step: tapers toward the light/dark extremes so tints/shades aren't muddy. */
function chromaEnvelope(i: number, n: number): number {
	if (n <= 1) return 1;
	return 0.45 + 0.55 * Math.sin(Math.PI * (i / (n - 1)));
}

export interface SolveRampOptions {
	seed: string;
	/** One target contrast per step; length should equal `ctx.steps.length`. */
	ratios: number[];
	formula: ContrastFormula;
	/** Multiplier on the seed's chroma (1 = use the seed's chroma). */
	chroma: number;
	/** Near-zero chroma backbone (the neutral palette). */
	neutral: boolean;
}

/** Solve a full ramp against the mode background. */
export function solveRamp(options: SolveRampOptions, ctx: ModeCtx): ColorScale {
	const seed = toOklch(options.seed);
	const hue = seed.h;
	const baseChroma = options.neutral ? Math.min(seed.c, 0.012) : seed.c * options.chroma;
	const bgL = toOklch(ctx.background).l;

	const scale: ColorScale = {};
	const n = ctx.steps.length;
	for (let i = 0; i < n; i++) {
		const step = ctx.steps[i]!;
		const target = options.ratios[i] ?? options.ratios.at(-1) ?? 1;
		const chroma = baseChroma * chromaEnvelope(i, n);
		scale[step] = oklchCss(solveStep(target, hue, chroma, bgL, ctx, options.formula));
	}
	return scale;
}

function contrastAt(l: number, chroma: number, hue: number, bg: string, formula: ContrastFormula): number {
	const color = gamutMap({ l, c: chroma, h: hue });
	return formula === "apca" ? apca(color, bg) : wcag2(color, bg);
}

/**
 * Binary-search OKLCH lightness for the target contrast.
 * Light mode: bg is light, steps darken (L ∈ [0, bgL]); lower L ⇒ higher contrast.
 * Dark mode:  bg is dark,  steps lighten (L ∈ [bgL, 1]); higher L ⇒ higher contrast.
 */
function solveStep(
	target: number,
	hue: number,
	chroma: number,
	bgL: number,
	ctx: ModeCtx,
	formula: ContrastFormula,
): Oklch {
	let lo = ctx.isDark ? bgL : 0;
	let hi = ctx.isDark ? 1 : bgL;
	if (hi - lo < 1e-3) {
		// Degenerate background (e.g. a light mode whose bg is near-black): keep a usable window.
		if (ctx.isDark) lo = Math.max(0, hi - 1e-3);
		else hi = Math.min(1, lo + 1e-3);
	}
	// High-contrast extreme (pure dark in light mode, pure light in dark mode).
	const extreme = ctx.isDark ? hi : lo;
	if (contrastAt(extreme, chroma, hue, ctx.background, formula) <= target) {
		// Target unreachable (ratio higher than the background allows, or an APCA
		// Lc below the platform floor) — clamp to the max-contrast extreme rather
		// than walking onto a flat / discontinuous region.
		return gamutMap({ l: extreme, c: chroma, h: hue });
	}
	for (let iter = 0; iter < 20; iter++) {
		const mid = (lo + hi) / 2;
		const needsMoreContrast = contrastAt(mid, chroma, hue, ctx.background, formula) < target;
		if (ctx.isDark ? needsMoreContrast : !needsMoreContrast) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	return gamutMap({ l: (lo + hi) / 2, c: chroma, h: hue });
}
