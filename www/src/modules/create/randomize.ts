import { DEFAULT_COLOR_CONFIG } from "@/registry/theme";

import type { ColorConfig } from "@/registry/theme";

function hslToHex(h: number, s: number, l: number): string {
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0;
	let g = 0;
	let b = 0;
	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];
	const toHex = (v: number) =>
		Math.round((v + m) * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * A fresh, usable palette: a vivid accent on a near-neutral base. Status hues are left intact;
 * tuning knobs are dropped — they were calibrated for the previous seed and would skew the new one.
 */
export function randomizeColors(base: ColorConfig = DEFAULT_COLOR_CONFIG): ColorConfig {
	const accent = hslToHex(Math.floor(Math.random() * 360), 0.62 + Math.random() * 0.28, 0.5 + Math.random() * 0.08);
	const neutral = hslToHex(Math.floor(Math.random() * 360), 0.03 + Math.random() * 0.05, 0.5);
	return { ...base, seeds: { ...base.seeds, accent, neutral }, knobs: undefined };
}
