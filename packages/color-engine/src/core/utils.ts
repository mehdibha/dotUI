/**
 * Core color utilities for @dotui/color-engine
 *
 * Pure functions for color conversions and contrast calculations.
 * No external dependencies - just math.
 */

import type { HSL, OKLCH, RGB } from "./types";

export { SCALE_STEPS } from "./types";

// ============================================================================
// Hex <-> RGB Conversions
// ============================================================================

/**
 * Parse a hex color string to RGB tuple
 * Supports #RGB, #RRGGBB, RGB, RRGGBB formats
 */
export function hexToRgb(hex: string): RGB {
	// Remove # if present
	const cleanHex = hex.replace(/^#/, "");

	// Handle shorthand (#RGB)
	const fullHex =
		cleanHex.length === 3
			? cleanHex
					.split("")
					.map((c) => c + c)
					.join("")
			: cleanHex;

	if (fullHex.length !== 6) {
		throw new Error(`Invalid hex color: ${hex}`);
	}

	const num = parseInt(fullHex, 16);
	if (Number.isNaN(num)) {
		throw new Error(`Invalid hex color: ${hex}`);
	}

	return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Convert RGB tuple to hex string
 */
export function rgbToHex(rgb: RGB): string {
	const r = Math.round(clamp(rgb[0], 0, 255));
	const g = Math.round(clamp(rgb[1], 0, 255));
	const b = Math.round(clamp(rgb[2], 0, 255));
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ============================================================================
// RGB <-> HSL Conversions
// ============================================================================

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;

	if (max === min) {
		return { h: 0, s: 0, l: l * 100 };
	}

	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

	let h = 0;
	if (max === r) {
		h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
	} else if (max === g) {
		h = ((b - r) / d + 2) / 6;
	} else {
		h = ((r - g) / d + 4) / 6;
	}

	return {
		h: h * 360,
		s: s * 100,
		l: l * 100,
	};
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSL): RGB {
	const h = hsl.h / 360;
	const s = hsl.s / 100;
	const l = hsl.l / 100;

	if (s === 0) {
		const gray = Math.round(l * 255);
		return [gray, gray, gray];
	}

	const hue2rgb = (p: number, q: number, t: number): number => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};

	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;

	return [
		Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
		Math.round(hue2rgb(p, q, h) * 255),
		Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
	];
}

// ============================================================================
// RGB <-> OKLCH Conversions
// ============================================================================

/**
 * Convert RGB to linear RGB (remove gamma)
 */
function rgbToLinear(rgb: RGB): [number, number, number] {
	return rgb.map((v) => {
		const c = v / 255;
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	}) as [number, number, number];
}

/**
 * Convert linear RGB to RGB (apply gamma)
 */
function linearToRgb(linear: [number, number, number]): RGB {
	return linear.map((c) => {
		const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
		return Math.round(clamp(v * 255, 0, 255));
	}) as RGB;
}

/**
 * Convert RGB to OKLCH
 */
export function rgbToOklch(rgb: RGB): OKLCH {
	const [lr, lg, lb] = rgbToLinear(rgb);

	// RGB to OKLab
	const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
	const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
	const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

	const l = Math.cbrt(l_);
	const m = Math.cbrt(m_);
	const s = Math.cbrt(s_);

	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

	// OKLab to OKLCH
	const C = Math.sqrt(a * a + b * b);
	let H = (Math.atan2(b, a) * 180) / Math.PI;
	if (H < 0) H += 360;

	return { l: L, c: C, h: H };
}

/**
 * Convert OKLCH to RGB
 */
export function oklchToRgb(oklch: OKLCH): RGB {
	const { l: L, c: C, h: H } = oklch;

	// OKLCH to OKLab
	const hRad = (H * Math.PI) / 180;
	const a = C * Math.cos(hRad);
	const b = C * Math.sin(hRad);

	// OKLab to linear RGB
	const l = L + 0.3963377774 * a + 0.2158037573 * b;
	const m = L - 0.1055613458 * a - 0.0638541728 * b;
	const s = L - 0.0894841775 * a - 1.291485548 * b;

	const l_ = l * l * l;
	const m_ = m * m * m;
	const s_ = s * s * s;

	const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
	const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
	const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

	return linearToRgb([lr, lg, lb]);
}

// ============================================================================
// Contrast Calculations (WCAG 2.1)
// ============================================================================

/**
 * Calculate relative luminance of an RGB color
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function luminance(rgb: RGB): number {
	const linearize = (v: number): number => {
		const c = v / 255;
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	};
	const r = linearize(rgb[0]);
	const g = linearize(rgb[1]);
	const b = linearize(rgb[2]);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG 2.1 contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function contrastRatio(rgb1: RGB, rgb2: RGB): number {
	const l1 = luminance(rgb1);
	const l2 = luminance(rgb2);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate contrast with directionality (for Leonardo compatibility)
 * Positive = foreground is darker than background
 * Negative = foreground is lighter than background
 */
export function contrastWithDirection(foreground: RGB, background: RGB, backgroundLightness?: number): number {
	const bgLum = backgroundLightness !== undefined ? backgroundLightness / 100 : luminance(background);
	const fgLum = luminance(foreground);

	const l1 = Math.max(fgLum, bgLum);
	const l2 = Math.min(fgLum, bgLum);
	const ratio = (l1 + 0.05) / (l2 + 0.05);

	// Light background: darker colors are positive
	// Dark background: lighter colors are positive
	if (bgLum >= 0.5) {
		return fgLum < bgLum ? ratio : -ratio;
	} else {
		return fgLum > bgLum ? ratio : -ratio;
	}
}

// ============================================================================
// APCA Contrast (WCAG 3 Draft)
// ============================================================================

/**
 * Calculate APCA contrast
 * Returns a value between -108 and 106
 * Based on APCA-W3 algorithm
 */
export function apcaContrast(foreground: RGB, background: RGB): number {
	// Linearize with sRGB TRC
	const [fR, fG, fB] = foreground.map((v) => (v / 255) ** 2.4) as RGB;
	const [bR, bG, bB] = background.map((v) => (v / 255) ** 2.4) as RGB;

	// Calculate Y (luminance) using APCA coefficients
	const fY = 0.2126729 * fR + 0.7151522 * fG + 0.072175 * fB;
	const bY = 0.2126729 * bR + 0.7151522 * bG + 0.072175 * bB;

	// APCA constants
	const normBG = 0.56;
	const normTXT = 0.57;
	const revTXT = 0.62;
	const revBG = 0.65;
	const blkThrs = 0.022;
	const blkClmp = 1.414;
	const scaleBoW = 1.14;
	const scaleWoB = 1.14;
	const loBoWoffset = 0.027;
	const loWoBoffset = 0.027;

	// Clamp luminance
	const txtY = fY > blkThrs ? fY : fY + (blkThrs - fY) ** blkClmp;
	const bgY = bY > blkThrs ? bY : bY + (blkThrs - bY) ** blkClmp;

	// Calculate raw contrast
	let contrast: number;
	if (bgY > txtY) {
		// Dark text on light background
		contrast = (bgY ** normBG - txtY ** normTXT) * scaleBoW;
		contrast = contrast < loBoWoffset ? 0 : contrast - loBoWoffset;
	} else {
		// Light text on dark background
		contrast = (bgY ** revBG - txtY ** revTXT) * scaleWoB;
		contrast = contrast > -loWoBoffset ? 0 : contrast + loWoBoffset;
	}

	return contrast * 100;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * Round a number to specified decimal places
 */
export function round(value: number, decimals = 0): number {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

/**
 * Interpolate between two RGB colors
 */
export function interpolateRgb(rgb1: RGB, rgb2: RGB, t: number): RGB {
	return [
		Math.round(lerp(rgb1[0], rgb2[0], t)),
		Math.round(lerp(rgb1[1], rgb2[1], t)),
		Math.round(lerp(rgb1[2], rgb2[2], t)),
	];
}

/**
 * Interpolate between two OKLCH colors
 * Handles hue interpolation correctly (shortest path)
 */
export function interpolateOklch(oklch1: OKLCH, oklch2: OKLCH, t: number): OKLCH {
	// Handle hue interpolation (shortest path around the circle)
	let h1 = oklch1.h;
	let h2 = oklch2.h;

	const hDiff = h2 - h1;
	if (hDiff > 180) {
		h1 += 360;
	} else if (hDiff < -180) {
		h2 += 360;
	}

	let h = lerp(h1, h2, t) % 360;
	if (h < 0) h += 360;

	return {
		l: lerp(oklch1.l, oklch2.l, t),
		c: lerp(oklch1.c, oklch2.c, t),
		h,
	};
}

/**
 * Check if a hex color string is valid
 */
export function isValidHex(hex: string): boolean {
	return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

/**
 * Get the best text color (black or white) for a given background
 */
export function getContrastTextColor(background: string): string {
	const rgb = hexToRgb(background);
	const blackContrast = contrastRatio(rgb, [0, 0, 0]);
	const whiteContrast = contrastRatio(rgb, [255, 255, 255]);
	return blackContrast > whiteContrast ? "#000000" : "#ffffff";
}
