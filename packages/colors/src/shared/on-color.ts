/**
 * Foreground (`on-*`) picker (§4.3).
 *
 * For a background, pick the readable foreground: try the hue-tinted pole the bg
 * calls for (light fg for a dark bg, dark fg for a light bg), then the other
 * tinted pole, then fall back to a pure pole in the mid-tone contrast valley.
 * Returns an honest result object — `meetsFloor` can be false for APCA on a
 * mid-light bg (the floor is genuinely unreachable there), surfaced rather than faked.
 */

import { type ContrastFormula, gamutMap, makeContrast, type Oklch, oklchCss, toOklch, toSrgb } from "./color";

import type { ColorScale } from "./types";

export type { ContrastFormula };

/** WCAG 2 AA normal-text minimum. */
const WCAG2_TEXT_MIN = 4.5;
/** APCA Lc body-text target (Bronze). */
const APCA_TEXT_MIN = 60;
/** Below this OKLCH lightness a bg is "dark-ish" → prefer a light foreground (Material T60 analogue). */
const LIGHT_PIVOT = 0.62;

export type OnPole = "tinted-light" | "tinted-dark" | "pure-light" | "pure-dark";

export interface OnColor {
	value: string;
	formula: ContrastFormula;
	ratio: number;
	meetsFloor: boolean;
	pole: OnPole;
}

export interface OnColorOptions {
	/** Use hue-tinted poles (default true); false = pure black/white only. */
	tinted?: boolean;
}

/** Pick a readable foreground for a single background color. */
export function onColor(background: string, formula: ContrastFormula = "wcag2", opts: OnColorOptions = {}): OnColor {
	const tinted = opts.tinted ?? true;
	const { l: bgL, h } = toOklch(background);
	const min = formula === "apca" ? APCA_TEXT_MIN : WCAG2_TEXT_MIN;
	const score = makeContrast(background, formula);
	const wantLight = bgL < LIGHT_PIVOT;

	const make = (value: Oklch, pole: OnPole): OnColor => {
		// Gamut-map (a light-tinted pole is out of sRGB at some hues) and score the
		// ROUNDED emitted string, so meetsFloor matches what verify() sees — a grazing
		// tinted pole that rounds below the floor then correctly falls through to a pure pole.
		const css = oklchCss(gamutMap(value));
		const ratio = score(toOklch(css));
		return { value: css, formula, ratio, meetsFloor: ratio >= min, pole };
	};

	if (tinted) {
		const tintLight: Oklch = { l: 0.985, c: 0.02, h };
		const tintDark: Oklch = { l: 0.17, c: 0.03, h };
		const first = wantLight ? make(tintLight, "tinted-light") : make(tintDark, "tinted-dark");
		if (first.meetsFloor) return first;
		const second = wantLight ? make(tintDark, "tinted-dark") : make(tintLight, "tinted-light");
		if (second.meetsFloor) return second;
	}

	// Mid-tone valley (or tinted disabled): pure poles maximize achievable contrast.
	const pureLight = make({ l: 1, c: 0, h: 0 }, "pure-light");
	const pureDark = make({ l: 0, c: 0, h: 0 }, "pure-dark");
	return pureLight.ratio >= pureDark.ratio ? pureLight : pureDark;
}

/** `on-*` value per step of a scale (same keys as `scale`). */
export function computeOnColors(scale: ColorScale, formula: ContrastFormula = "wcag2"): ColorScale {
	const on: ColorScale = {};
	for (const [step, value] of Object.entries(scale)) {
		on[step] = onColor(value, formula).value;
	}
	return on;
}

/**
 * Pure black/white foreground pick — replicates `tailwindcss-autocontrast`'s
 * `getContrastColor`, the plugin that bakes dotUI's `--on-*` at Tailwind-compile time:
 * WCAG relative luminance of the sRGB color (rounded to 8-bit, as the plugin does), then
 * whichever of black/white has the higher contrast. dotUI's live preview emits `--on-*`
 * with this so the in-browser palette matches what `shadcn add` ships — kept in lockstep by
 * a parity test. Distinct from {@link onColor}, which returns AA-verified hue-tinted poles.
 */
export function onBlackWhite(background: string): "black" | "white" {
	const { r, g, b } = toSrgb(background);
	const lin = (channel: number): number => {
		const s = Math.round(channel * 255) / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	};
	const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
	// contrast-with-black = (L+0.05)/0.05 ; contrast-with-white = 1.05/(L+0.05)
	return (luminance + 0.05) / 0.05 > 1.05 / (luminance + 0.05) ? "black" : "white";
}
