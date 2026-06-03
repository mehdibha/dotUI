/**
 * Post-generation contrast verification (§4.4).
 *
 * A pure reporter: given resolved fg/bg pairings, returns per-pairing ratio +
 * level + (optionally) a suggested foreground that clears the AA target. It never
 * mutates the theme — the actual nudge/warn UX lives in the semantic layer
 * (`@dotui/theme`, Phase 1) where a token can be re-pointed or a step nudged.
 */

import { apca, type ContrastFormula, gamutMap, oklchCss, toOklch, wcag2 } from "../shared/color";
import { targetAAA, targetFor } from "./thresholds";

import type { Theme } from "../shared/types";
import type { Level, PairingResult, SemanticPairing, SizeClass, VerifyOptions, VerifyReport } from "./types";

export type { Level, PairingResult, SemanticPairing, SizeClass, VerifyOptions, VerifyReport } from "./types";
export { deltaLClearsAA, targetAAA, targetFor } from "./thresholds";

function ratioOf(fg: string, bg: string, formula: ContrastFormula): number {
	return formula === "apca" ? apca(fg, bg) : wcag2(fg, bg);
}

function levelOf(ratio: number, sizeClass: SizeClass, formula: ContrastFormula): Level {
	if (ratio >= targetAAA(sizeClass, formula)) return "AAA";
	if (ratio >= targetFor(sizeClass, formula)) return "AA";
	return "fail";
}

/**
 * Adjust only the foreground's lightness to clear `target` against `bg`, moving the
 * minimal distance toward the higher-contrast extreme. Returns the fg unchanged if it
 * already clears, or `null` if even the extreme can't reach the target.
 */
export function nudgeForTarget(fg: string, bg: string, target: number, formula: ContrastFormula): string | null {
	const f = toOklch(fg);
	const at = (l: number): number => ratioOf(oklchCss(gamutMap({ l, c: f.c, h: f.h })), bg, formula);
	if (at(f.l) >= target) return fg;
	const up = at(1);
	const down = at(0);
	if (Math.max(up, down) < target) return null;
	let lo = f.l;
	let hi = up >= down ? 1 : 0;
	for (let k = 0; k < 24; k++) {
		const mid = (lo + hi) / 2;
		if (at(mid) >= target) hi = mid;
		else lo = mid;
	}
	return oklchCss(gamutMap({ l: hi, c: f.c, h: f.h }));
}

function verifyPairing(p: SemanticPairing, formula: ContrastFormula, suggestFix: boolean): PairingResult {
	const sizeClass = p.sizeClass ?? "body";
	const ratio = ratioOf(p.fg, p.bg, formula);
	const target = targetFor(sizeClass, formula);
	const meets = ratio >= target;
	return {
		name: p.name,
		fg: p.fg,
		bg: p.bg,
		sizeClass,
		formula,
		ratio,
		target,
		level: levelOf(ratio, sizeClass, formula),
		meets,
		suggestedFg: !meets && suggestFix ? (nudgeForTarget(p.fg, p.bg, target, formula) ?? undefined) : undefined,
	};
}

/** Verify a set of resolved fg/bg pairings. */
export function verify(pairings: SemanticPairing[], opts: VerifyOptions = {}): VerifyReport {
	const formula = opts.formula ?? "wcag2";
	const suggestFix = opts.suggestFix ?? true;
	const results = pairings.map((p) => verifyPairing(p, formula, suggestFix));
	const failures = results.filter((r) => !r.meets);
	return { results, failures, passed: failures.length === 0 };
}

/** Build on-*↔step pairings from a theme (the engine's own foreground contract). */
export function pairingsFromTheme(theme: Theme): SemanticPairing[] {
	const pairs: SemanticPairing[] = [];
	for (const [modeName, mode] of Object.entries(theme)) {
		for (const [palette, scale] of Object.entries(mode.scales)) {
			const on = mode.on[palette];
			if (!on) continue;
			for (const step of Object.keys(scale)) {
				const fg = on[step];
				const bg = scale[step];
				if (fg && bg) pairs.push({ name: `${modeName}.${palette}.${step}`, fg, bg, sizeClass: "body" });
			}
		}
	}
	return pairs;
}

/** Verify a theme's on-* foreground contract (every on-* against its step). */
export function verifyTheme(theme: Theme, opts: VerifyOptions = {}): VerifyReport {
	return verify(pairingsFromTheme(theme), opts);
}
