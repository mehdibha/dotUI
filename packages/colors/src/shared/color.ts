/**
 * Thin OKLCH color-ops wrapper over colorjs.io.
 *
 * Every color operation the engine needs (parse → OKLCH, gamut-map to sRGB via
 * the CSS Color 4 method, format `oklch()`, WCAG2 / APCA contrast) lives here so
 * the rest of the engine never touches colorjs.io directly. This is the single
 * seam to swap onto a lighter hot-path library (e.g. culori) later without
 * touching the solver.
 */

import Color from "colorjs.io";

export type Oklch = { l: number; c: number; h: number };

function round(x: number, n: number): number {
	const f = 10 ** n;
	return Math.round(x * f) / f;
}

function colorOf(x: string | Oklch): Color {
	return typeof x === "string" ? new Color(x) : new Color("oklch", [x.l, x.c, Number.isNaN(x.h) ? 0 : x.h]);
}

/** Parse any CSS color string into OKLCH coords. Achromatic hue normalizes to 0. */
export function toOklch(input: string): Oklch {
	const [l, c, h] = new Color(input).to("oklch").coords;
	return { l: l ?? 0, c: c ?? 0, h: h == null || Number.isNaN(h) ? 0 : h };
}

/** Reduce an OKLCH color into the sRGB gamut using the CSS Color 4 method (chroma reduction + clip). */
export function gamutMap({ l, c, h }: Oklch): Oklch {
	const mapped = new Color("oklch", [l, c, Number.isNaN(h) ? 0 : h]).toGamut({ space: "srgb", method: "css" });
	const [ml, mc, mh] = mapped.to("oklch").coords;
	return { l: ml ?? 0, c: mc ?? 0, h: mh == null || Number.isNaN(mh) ? 0 : mh };
}

/** Format OKLCH coords as a compact, valid `oklch()` string. */
export function oklchCss({ l, c, h }: Oklch): string {
	const L = round(Math.min(1, Math.max(0, l)), 4);
	const C = round(Math.max(0, c), 4);
	if (C < 0.0005) return `oklch(${L} 0 0)`;
	const H = round(((h % 360) + 360) % 360, 2);
	return `oklch(${L} ${C} ${H})`;
}

/** WCAG 2.1 contrast ratio (1–21) between two colors (order-independent). */
export function wcag2(a: string | Oklch, b: string | Oklch): number {
	return colorOf(a).contrast(colorOf(b), "WCAG21");
}

/** Absolute APCA lightness contrast (Lc, 0–~108) of `fg` text on `bg`. */
export function apca(fg: string | Oklch, bg: string | Oklch): number {
	return Math.abs(colorOf(bg).contrast(colorOf(fg), "APCA"));
}
