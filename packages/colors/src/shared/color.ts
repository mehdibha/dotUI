/**
 * The single colorjs.io seam.
 *
 * Every color operation the engine needs (parse → OKLCH, gamut-map to sRGB via
 * the CSS Color 4 method, format `oklch()`, WCAG2 / APCA contrast) lives here so
 * nothing else in the package imports colorjs.io directly. NaN/null hue is
 * normalized to 0 in exactly one place (the `oklch()` factory). This is the seam
 * to swap onto a lighter hot-path lib (culori) later without touching producers.
 */

import Color from "colorjs.io";

export type Oklch = { l: number; c: number; h: number };
export type ContrastFormula = "wcag2" | "apca";

function round(x: number, n: number): number {
	const f = 10 ** n;
	return Math.round(x * f) / f;
}

/** Normalize an achromatic / undefined hue to 0 (once, here). */
function normHue(h: number | null | undefined): number {
	return h == null || Number.isNaN(h) ? 0 : h;
}

/** The one place an OKLCH `Color` is constructed — hue normalized. */
function oklch(o: Oklch): Color {
	return new Color("oklch", [o.l, o.c, normHue(o.h)]);
}

function colorOf(x: string | Oklch): Color {
	return typeof x === "string" ? new Color(x) : oklch(x);
}

/** Parse any CSS color string into OKLCH coords (achromatic hue → 0). */
export function toOklch(input: string): Oklch {
	const [l, c, h] = new Color(input).to("oklch").coords;
	return { l: l ?? 0, c: c ?? 0, h: normHue(h) };
}

/** sRGB channels (0..1) of any color. */
export function toSrgb(input: string | Oklch): { r: number; g: number; b: number } {
	const [r, g, b] = colorOf(input).to("srgb").coords;
	return { r: r ?? 0, g: g ?? 0, b: b ?? 0 };
}

/** Reduce an OKLCH color into the sRGB gamut (CSS Color 4 method: chroma reduce + clip). */
export function gamutMap(o: Oklch): Oklch {
	const [l, c, h] = oklch(o).toGamut({ space: "srgb", method: "css" }).to("oklch").coords;
	return { l: l ?? 0, c: c ?? 0, h: normHue(h) };
}

/** Format OKLCH coords as a compact, valid `oklch()` string (hue normalized before output). */
export function oklchCss(o: Oklch): string {
	const L = round(Math.min(1, Math.max(0, o.l)), 4);
	const C = round(Math.max(0, o.c), 4);
	if (C < 0.0005) return `oklch(${L} 0 0)`;
	const H = round(((normHue(o.h) % 360) + 360) % 360, 2);
	return `oklch(${L} ${C} ${H})`;
}

/** WCAG 2.1 contrast ratio (1–21), order-independent. */
export function wcag2(a: string | Oklch, b: string | Oklch): number {
	return colorOf(a).contrast(colorOf(b), "WCAG21");
}

/** Absolute APCA lightness contrast (Lc) of `fg` text on `bg`. */
export function apca(fg: string | Oklch, bg: string | Oklch): number {
	return Math.abs(colorOf(bg).contrast(colorOf(fg), "APCA"));
}

/**
 * Pre-parse a background once and return a fast contrast fn over OKLCH candidates.
 * Used on the contrast solver's hot path (≈132 probes/theme) so the bg isn't re-parsed each time.
 */
export function makeContrast(bg: string | Oklch, formula: ContrastFormula): (fg: Oklch) => number {
	const bgColor = colorOf(bg);
	return formula === "apca"
		? (fg) => Math.abs(bgColor.contrast(oklch(fg), "APCA"))
		: (fg) => bgColor.contrast(oklch(fg), "WCAG21");
}
