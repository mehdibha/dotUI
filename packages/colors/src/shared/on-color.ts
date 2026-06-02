/**
 * In-engine `on-*` foreground generation.
 *
 * For every step of a ramp, pick a readable foreground. We score a hue-tinted
 * near-white and a hue-tinted near-black against the step and choose the pole
 * that clears the text-contrast floor (preferring the one that does, else the
 * higher-contrast pole). Same code path for every algorithm — the engine ships
 * no foreground generation today, so this closes a real gap.
 */

import { apca, oklchCss, toOklch, wcag2, type Oklch } from "./color";

import type { ColorScale } from "./types";

export type ContrastFormula = "wcag2" | "apca";

/** WCAG 2 AA normal-text minimum. */
const WCAG2_TEXT_MIN = 4.5;
/** APCA Lc target for body text (Bronze ~ Lc 60+). */
const APCA_TEXT_MIN = 60;

/** Pick a readable foreground for a single background color. */
export function onColor(background: string, formula: ContrastFormula = "wcag2"): string {
	const { h } = toOklch(background);
	const min = formula === "apca" ? APCA_TEXT_MIN : WCAG2_TEXT_MIN;
	const score = (fg: Oklch): number => (formula === "apca" ? apca(fg, background) : wcag2(fg, background));

	// Aesthetic, hue-tinted poles first.
	const tintLight: Oklch = { l: 0.985, c: 0.02, h };
	const tintDark: Oklch = { l: 0.17, c: 0.03, h };
	const tinted = score(tintLight) >= score(tintDark) ? tintLight : tintDark;
	if (score(tinted) >= min) return oklchCss(tinted);

	// Mid-tone "contrast valley": fall back to (near-)pure poles, which maximize
	// achievable contrast (>= ~4.58 WCAG2 / ~legible APCA for any background).
	const pureLight: Oklch = { l: 1, c: 0, h: 0 };
	const pureDark: Oklch = { l: 0, c: 0, h: 0 };
	return oklchCss(score(pureLight) >= score(pureDark) ? pureLight : pureDark);
}

/** Compute `on-*` foregrounds for every step of a scale (same keys as `scale`). */
export function computeOnColors(scale: ColorScale, formula: ContrastFormula = "wcag2"): ColorScale {
	const on: ColorScale = {};
	for (const [step, value] of Object.entries(scale)) {
		on[step] = onColor(value, formula);
	}
	return on;
}
