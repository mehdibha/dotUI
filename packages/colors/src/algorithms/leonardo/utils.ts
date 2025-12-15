/**
 * Leonardo algorithm utilities
 * Migrated to Color.js from chroma-js/ciebase/ciecam02/hsluv/apca-w3
 */

import Color from "colorjs.io";
import { catmullRom2bezier, prepareCurve } from "../../utils/curve";
import type { LeonardoColorspace, ContrastFormula } from "../../types";

// Colorspace mapping from Leonardo names to Color.js space names
export const colorSpaces: Record<string, string> = {
	CAM02: "cam16-jmh", // Using CAM16 as successor to CIECAM02
	CAM02p: "cam16-jmh",
	HEX: "srgb",
	HSL: "hsl",
	HSLuv: "hsluv",
	HSV: "hsv",
	LAB: "lab",
	LCH: "lch",
	RGB: "srgb",
	OKLAB: "oklab",
	OKLCH: "oklch",
};

/**
 * Round a number to specified decimal places
 */
export function round(x: number, n = 0): number {
	const ten = 10 ** n;
	return Math.round(x * ten) / ten;
}

/**
 * Multiply contrast ratios while preserving normalized behavior
 */
export function multiplyRatios(ratio: number, multiplier: number): number {
	let r: number;
	if (ratio > 1) {
		r = (ratio - 1) * multiplier + 1;
	} else if (ratio < -1) {
		r = (ratio + 1) * multiplier - 1;
	} else {
		r = 1;
	}
	return round(r, 2);
}

/**
 * Convert color to CAM16 JMh array (replaces CIECAM02 JCh)
 * Returns [J, M, h] where J is lightness (0-100)
 */
export function cArray(c: string): number[] {
	const color = new Color(String(c)).to("cam16-jmh");
	return [color.coords[0] ?? 0, color.coords[1] ?? 0, color.coords[2] ?? 0];
}

/**
 * Convert color to HSLuv array [H, S, L]
 */
export function hsluvArray(c: string): number[] {
	const color = new Color(String(c)).to("hsluv");
	return [color.coords[0] ?? 0, color.coords[1] ?? 0, color.coords[2] ?? 0];
}

/**
 * Filter NaN values to 0
 */
function filterNaN(x: number): number {
	return Number.isNaN(x) ? 0 : x;
}

/**
 * Get color in a specific color space as array
 */
function colorToSpaceArray(color: string, space: string): number[] {
	const c = new Color(String(color)).to(space);
	return [...c.coords];
}

/**
 * Create color from space array
 */
function colorFromSpaceArray(coords: number[], space: string): string {
	const color = new Color(space, coords as [number, number, number]);
	return color.to("srgb").toString({ format: "hex" });
}

/**
 * Smooth scale interpolation using Catmull-Rom to Bezier conversion
 */
function smoothScale(
	ColorsArray: number[][],
	domains: number[],
	space: string,
): (d: number) => string {
	const points: number[][] = [[], [], []];

	ColorsArray.forEach((color, i) =>
		points.forEach((point, j) => point.push(domains[i] ?? 0, color[j] ?? 0)),
	);

	// Handle NaN values in chroma for lch
	if (space === "lch") {
		const point = points[1];
		if (point) {
			for (let i = 1; i < point.length; i += 2) {
				if (Number.isNaN(point[i])) {
					point[i] = 0;
				}
			}
		}
	}

	// Handle leading, trailing, and middle NaN values
	points.forEach((point) => {
		if (!point) return;
		const nans: number[] = [];

		// Leading NaNs
		for (let i = 1; i < point.length; i += 2) {
			if (Number.isNaN(point[i])) {
				nans.push(i);
			} else {
				nans.forEach((j) => {
					point[j] = point[i] ?? 0;
				});
				nans.length = 0;
				break;
			}
		}

		// All are grey case - use a safe hue value
		if (nans.length) {
			const safeHue = 0;
			nans.forEach((j) => {
				point[j] = safeHue;
			});
		}
		nans.length = 0;

		// Trailing NaNs
		for (let i = point.length - 1; i > 0; i -= 2) {
			if (Number.isNaN(point[i])) {
				nans.push(i);
			} else {
				nans.forEach((j) => {
					point[j] = point[i] ?? 0;
				});
				break;
			}
		}

		// Other NaNs - remove them
		for (let i = 1; i < point.length; i += 2) {
			if (Number.isNaN(point[i])) {
				point.splice(i - 1, 2);
				i -= 2;
			}
		}

		// Force hue to go on shortest route for hue-based spaces
		if (["lch", "hsl", "hsluv", "hsv", "cam16-jmh"].includes(space)) {
			let prev = point[1] ?? 0;
			let addon = 0;
			for (let i = 3; i < point.length; i += 2) {
				const p = (point[i] ?? 0) + addon;
				const zero = Math.abs(prev - p);
				const plus = Math.abs(prev - (p + 360));
				const minus = Math.abs(prev - (p - 360));
				if (plus < zero && plus < minus) {
					addon += 360;
				}
				if (minus < zero && minus < plus) {
					addon -= 360;
				}
				point[i] = (point[i] ?? 0) + addon;
				prev = point[i] ?? 0;
			}
		}
	});

	const prep = points.map((point) =>
		catmullRom2bezier(point).map((curve) =>
			prepareCurve(
				curve[0] ?? 0,
				curve[1] ?? 0,
				curve[2] ?? 0,
				curve[3] ?? 0,
				curve[4] ?? 0,
				curve[5] ?? 0,
				curve[6] ?? 0,
				curve[7] ?? 0,
			),
		),
	);

	return (d: number): string => {
		const ch = prep.map((p) => {
			for (let i = 0; i < p.length; i++) {
				const fn = p[i];
				if (fn) {
					const res = fn(d);
					if (res != null) {
						return res;
					}
				}
			}
			return 0;
		}) as number[];

		// Clamp negative chroma/colorfulness for CAM16
		if (space === "cam16-jmh" && (ch[1] ?? 0) < 0) {
			ch[1] = 0;
		}

		return colorFromSpaceArray(ch, space);
	};
}

/**
 * Create a power scale function
 */
function makePowScale(
	exp = 1,
	domains = [0, 1],
	range = [0, 1],
): (x: number) => number {
	const d0 = domains[0] ?? 0;
	const d1 = domains[1] ?? 1;
	const r0 = range[0] ?? 0;
	const r1 = range[1] ?? 1;
	const m = (r1 - r0) / (d1 ** exp - d0 ** exp);
	const c = r0 - m * d0 ** exp;
	return (x: number) => m * x ** exp + c;
}

export interface CreateScaleOptions {
	swatches: number;
	colorKeys: string[];
	colorspace?: LeonardoColorspace;
	shift?: number;
	fullScale?: boolean;
	smooth?: boolean;
	distributeLightness?: "linear" | "polynomial";
	sortColor?: boolean;
	asFun?: boolean;
}

/**
 * Create a color scale from color keys
 */
export function createScale({
	swatches,
	colorKeys,
	colorspace = "LAB",
	shift = 1,
	fullScale = true,
	smooth = false,
	distributeLightness = "linear",
	sortColor = true,
	asFun = false,
}: CreateScaleOptions): string[] | ((pos: number) => string) {
	const space = colorSpaces[colorspace];
	if (!space) {
		throw new Error(`Colorspace "${colorspace}" not supported`);
	}
	if (!colorKeys) {
		throw new Error(`Colorkeys missing: returned "${colorKeys}"`);
	}

	let domains: number[];

	if (fullScale) {
		// Set domain based on CAM16 J lightness against full black-to-white scale
		domains = colorKeys
			.map((key) => {
				const cam16 = cArray(key);
				return swatches - swatches * ((cam16[0] ?? 0) / 100);
			})
			.sort((a, b) => a - b)
			.concat(swatches);

		domains.unshift(0);
	} else {
		// Domains as percentage of available luminosity range
		const lums = colorKeys.map((c) => (cArray(c)[0] ?? 0) / 100);
		const min = Math.min(...lums);
		const max = Math.max(...lums);

		domains = lums
			.map((lum) => {
				if (lum === 0 || isNaN((lum - min) / (max - min))) return 0;
				return swatches - ((lum - min) / (max - min)) * swatches;
			})
			.sort((a, b) => a - b);
	}

	// Apply power scale transformation
	const sqrtDomains = makePowScale(shift, [1, swatches], [1, swatches]);
	const transformedDomains = domains.map((d) => Math.max(0, sqrtDomains(d)));
	domains = transformedDomains;

	if (distributeLightness === "polynomial") {
		const polynomial = (x: number): number => {
			return Math.sqrt(Math.sqrt((Math.pow(x, 2.25) + Math.pow(x, 4)) / 2));
		};

		const percDomains = domains.map((d) => d / swatches);
		domains = percDomains.map((d) => polynomial(d) * swatches);
	}

	// Sort colors by lightness (CAM16 J)
	const sortedColor = colorKeys
		.map((c, i) => ({ colorKeys: cArray(c), index: i }))
		.sort((c1, c2) => (c2.colorKeys[0] ?? 0) - (c1.colorKeys[0] ?? 0))
		.map((data) => colorKeys[data.index]!);

	let ColorsArray: string[];

	if (fullScale) {
		ColorsArray = ["#ffffff", ...sortedColor, "#000000"];
	} else {
		ColorsArray = sortColor ? sortedColor : colorKeys;
	}

	let scale: (pos: number) => string;
	let smoothScaleArray: string[] | undefined;

	if (smooth) {
		const ColorsSpaceArray = ColorsArray.map((d) => colorToSpaceArray(String(d), space));

		// Handle NaN in hue for grey colors in LCH
		if (space === "lch") {
			ColorsSpaceArray.forEach((c) => {
				if (c && c[1] !== undefined) {
					c[1] = Number.isNaN(c[1]) ? 0 : c[1];
				}
			});
		}

		// For CAM16, check if color is grey (low chroma) and mark hue as NaN
		if (space === "cam16-jmh") {
			for (let i = 0; i < ColorsArray.length; i++) {
				const lch = colorToSpaceArray(ColorsArray[i]!, "lch");
				if (Number.isNaN(lch[2]) || (lch[1] ?? 0) < 0.01) {
					if (ColorsSpaceArray[i]) {
						ColorsSpaceArray[i]![2] = NaN;
					}
				}
			}
		}

		scale = smoothScale(ColorsSpaceArray, domains, space);
		smoothScaleArray = new Array(swatches).fill(null).map((_, d) => scale(d));
	} else {
		// Create scale function using Color.js range interpolation
		scale = (pos: number): string => {
			// Find which segment we're in based on domains
			const clampedPos = Math.max(0, Math.min(swatches - 1, pos));

			// Find the two domain indices that bracket our position
			let lowerIdx = 0;
			for (let i = 0; i < domains.length - 1; i++) {
				if (clampedPos >= (domains[i] ?? 0)) {
					lowerIdx = i;
				}
			}
			const upperIdx = Math.min(lowerIdx + 1, domains.length - 1);

			const lowerDomain = domains[lowerIdx] ?? 0;
			const upperDomain = domains[upperIdx] ?? swatches;
			const lowerColor = ColorsArray[lowerIdx] ?? ColorsArray[0]!;
			const upperColor = ColorsArray[upperIdx] ?? ColorsArray[ColorsArray.length - 1]!;

			// Calculate interpolation position within this segment
			const segmentRange = upperDomain - lowerDomain;
			const t = segmentRange > 0 ? (clampedPos - lowerDomain) / segmentRange : 0;

			// Interpolate
			const c1 = new Color(lowerColor);
			const c2 = new Color(upperColor);
			const range = Color.range(c1, c2, { space });
			return range(Math.max(0, Math.min(1, t))).to("srgb").toString({ format: "hex" });
		};
	}

	if (asFun) {
		return scale;
	}

	if (smooth && smoothScaleArray) {
		return smoothScaleArray.filter((el: string | null) => el != null);
	}

	// Generate colors array
	const Colors: string[] = [];
	for (let i = 0; i < swatches; i++) {
		Colors.push(scale(i));
	}
	return Colors;
}

/**
 * Calculate WCAG 2.1 relative luminance
 */
export function luminance(r: number, g: number, b: number): number {
	const a = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	});
	return (a[0] ?? 0) * 0.2126 + (a[1] ?? 0) * 0.7152 + (a[2] ?? 0) * 0.0722;
}

/**
 * Get contrast ratio with direction (positive/negative based on theme)
 */
export function getContrast(
	color: number[],
	base: number[],
	baseV?: number,
	method: ContrastFormula = "wcag2",
): number {
	if (baseV === undefined) {
		const baseColor = new Color("srgb", [
			(base[0] ?? 0) / 255,
			(base[1] ?? 0) / 255,
			(base[2] ?? 0) / 255,
		]);
		const baseLightness = baseColor.to("hsluv").coords[2] ?? 0;
		baseV = round(baseLightness / 100, 2);
	}

	const fgColor = new Color("srgb", [
		(color[0] ?? 0) / 255,
		(color[1] ?? 0) / 255,
		(color[2] ?? 0) / 255,
	]);
	const bgColor = new Color("srgb", [
		(base[0] ?? 0) / 255,
		(base[1] ?? 0) / 255,
		(base[2] ?? 0) / 255,
	]);

	if (method === "wcag2") {
		const colorLum = luminance(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0);
		const baseLum = luminance(base[0] ?? 0, base[1] ?? 0, base[2] ?? 0);

		const cr1 = (colorLum + 0.05) / (baseLum + 0.05);
		const cr2 = (baseLum + 0.05) / (colorLum + 0.05);

		if (baseV < 0.5) {
			// Dark themes
			if (cr1 >= 1) {
				return cr1;
			}
			return -cr2;
		}
		// Light themes
		if (cr1 < 1) {
			return cr2;
		}
		if (cr1 === 1) {
			return cr1;
		}
		return -cr1;
	} else if (method === "wcag3") {
		// Use Color.js APCA contrast
		const apcaResult = bgColor.contrast(fgColor, "APCA");
		// Apply direction based on theme
		return baseV < 0.5 ? -apcaResult : apcaResult;
	} else {
		throw new Error(
			`Contrast calculation method ${method} unsupported; use 'wcag2' or 'wcag3'`,
		);
	}
}

/**
 * Find minimum positive ratio value
 */
export function minPositive(r: number[], formula: ContrastFormula): number {
	if (!r) {
		throw new Error("Array undefined");
	}
	if (!Array.isArray(r)) {
		throw new Error("Passed object is not an array");
	}
	const min = formula === "wcag2" ? 0 : 1;
	return Math.min(...r.filter((val) => val >= min));
}

/**
 * Generate ratio names for output
 */
export function ratioName(r: number[], formula: ContrastFormula): number[] {
	if (!r) {
		throw new Error("Ratios undefined");
	}
	r = r.sort((a, b) => a - b);

	const min = minPositive(r, formula);
	const minIndex = r.indexOf(min);
	const nArr: number[] = [];

	const rNeg = r.slice(0, minIndex);
	const rPos = r.slice(minIndex, r.length);

	// Name negative values
	for (let i = 0; i < rNeg.length; i++) {
		const d = 1 / (rNeg.length + 1);
		const m = d * 100;
		const nVal = m * (i + 1);
		nArr.push(round(nVal));
	}

	// Name positive values
	for (let i = 0; i < rPos.length; i++) {
		nArr.push((i + 1) * 100);
	}

	nArr.sort((a, b) => a - b);
	return nArr;
}

/**
 * Remove duplicates from array by property
 */
export function removeDuplicates<T extends Record<string, unknown>>(
	originalArray: T[],
	prop: string,
): T[] {
	const newArray: T[] = [];
	const lookupObject: Record<string, T> = {};

	for (let i = 0; i < originalArray.length; i++) {
		const item = originalArray[i];
		if (item) {
			lookupObject[String(item[prop])] = item;
		}
	}

	Object.keys(lookupObject).forEach((i) => {
		const item = lookupObject[i];
		if (item) {
			newArray.push(item);
		}
	});
	return newArray;
}

/**
 * Convert color value to specified output format
 */
export function convertColorValue(
	color: string,
	format: LeonardoColorspace,
	object = false,
): string | Record<string, number> {
	if (!color) {
		throw new Error(`Cannot convert color value of "${color}"`);
	}
	if (!colorSpaces[format]) {
		throw new Error(`Cannot convert to colorspace "${format}"`);
	}

	const space = colorSpaces[format]!;
	const colorObj = new Color(String(color)).to(space);
	const coords = [...colorObj.coords];

	if (format === "HEX") {
		if (object) {
			const srgb = colorObj.to("srgb");
			return {
				r: Math.round((srgb.coords[0] ?? 0) * 255),
				g: Math.round((srgb.coords[1] ?? 0) * 255),
				b: Math.round((srgb.coords[2] ?? 0) * 255),
			};
		}
		return colorObj.to("srgb").toString({ format: "hex" });
	}

	const colorObject: Record<string, number> = {};
	const newColorObj = coords.map(filterNaN);

	// Build output based on color space
	const spaceLetters: Record<string, string[]> = {
		"cam16-jmh": ["J", "M", "h"],
		hsluv: ["H", "S", "L"],
		hsl: ["h", "s", "l"],
		hsv: ["h", "s", "v"],
		lab: ["l", "a", "b"],
		lch: ["l", "c", "h"],
		oklab: ["l", "a", "b"],
		oklch: ["l", "c", "h"],
		srgb: ["r", "g", "b"],
	};

	const letters = spaceLetters[space] || ["x", "y", "z"];

	const formattedValues = newColorObj.map((ch, i) => {
		const letter = letters[i] ?? "x";
		let rnd: string | number = round(ch);
		colorObject[letter] = rnd;

		if (["lab", "lch", "cam16-jmh"].includes(space)) {
			if (!object) {
				if (letter.toLowerCase() === "l" || letter === "J") {
					rnd = rnd + "%";
				}
				if (letter.toLowerCase() === "h") {
					rnd = rnd + "deg";
				}
			}
		} else if (space === "srgb") {
			// sRGB coords are 0-1, need to scale to 0-255 for RGB output
			const scaled = round(ch * 255);
			colorObject[letter] = scaled;
			rnd = scaled;
		} else if (space !== "hsluv") {
			if (["s", "l", "v"].includes(letter)) {
				colorObject[letter] = round(ch, 2);
				if (!object) {
					rnd = round(ch * 100);
					rnd = rnd + "%";
				}
			} else if (letter === "h" && !object) {
				rnd = rnd + "deg";
			}
		}
		return rnd;
	});

	if (object) {
		return colorObject;
	}

	// Map space names for output
	const outputSpaceName: Record<string, string> = {
		"cam16-jmh": "cam16",
		srgb: "rgb",
	};
	const stringName = outputSpaceName[space] || space;
	return `${stringName}(${formattedValues.join(", ")})`;
}

export interface ColorWithModifiedKeys {
	_modifiedKeys: string[];
	_colorspace: LeonardoColorspace;
	_smooth: boolean;
}

/**
 * Search for colors matching target contrast ratios
 * Uses binary search for efficiency
 */
export function searchColors(
	color: ColorWithModifiedKeys,
	bgRgbArray: number[],
	baseV: number,
	ratioValues: number[],
	formula: ContrastFormula,
): string[] {
	const colorLen = 3000;
	const colorScale = createScale({
		swatches: colorLen,
		colorKeys: color._modifiedKeys,
		colorspace: color._colorspace,
		shift: 1,
		smooth: color._smooth,
		asFun: true,
	}) as (pos: number) => string;

	const ccache: Record<number, number> = {};

	const getContrast2 = (i: number): number => {
		if (ccache[i]) {
			return ccache[i];
		}
		const c = new Color(colorScale(i)).to("srgb");
		const rgb = [
			Math.round((c.coords[0] ?? 0) * 255),
			Math.round((c.coords[1] ?? 0) * 255),
			Math.round((c.coords[2] ?? 0) * 255),
		];
		const contrast = getContrast(rgb, bgRgbArray, baseV, formula);
		ccache[i] = contrast;
		return contrast;
	};

	const colorSearch = (x: number): number => {
		const first = getContrast2(0);
		const last = getContrast2(colorLen);
		const dir = first < last ? 1 : -1;
		const epsilon = 0.01;
		x += 0.005 * Math.sign(x);
		let step = colorLen / 2;
		let dot = step;
		let val = getContrast2(dot);
		let counter = 100;

		while (Math.abs(val - x) > epsilon && counter) {
			counter--;
			step /= 2;
			if (val < x) {
				dot += step * dir;
			} else {
				dot -= step * dir;
			}
			val = getContrast2(dot);
		}
		return round(dot, 3);
	};

	const outputColors: string[] = [];
	ratioValues.forEach((ratio) => outputColors.push(colorScale(colorSearch(+ratio))));
	return outputColors;
}
