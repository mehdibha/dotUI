/**
 * Theme class for Leonardo theme generation
 * Ported from Adobe's contrast-colors library for 100% Leonardo parity
 * Migrated to Color.js from chroma-js
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import ColorJS from "colorjs.io";
import { Color } from "./color";
import { BackgroundColor } from "./background-color";
import {
	colorSpaces,
	convertColorValue,
	multiplyRatios,
	ratioName,
	searchColors,
	round,
} from "./utils";
import type { LeonardoColorspace, ContrastFormula } from "../../types";

export interface ThemeColorInput {
	name: string;
	colorKeys: string[];
	colorspace?: LeonardoColorspace;
	ratios: number[] | Record<string, number>;
	smooth?: boolean;
}

export interface ThemeBackgroundInput {
	name: string;
	colorKeys: string[];
	colorspace?: LeonardoColorspace;
}

export interface ThemeOptions {
	colors: (Color | ThemeColorInput)[];
	backgroundColor: string | BackgroundColor | ThemeBackgroundInput;
	lightness?: number;
	contrast?: number;
	saturation?: number;
	output?: LeonardoColorspace;
	formula?: ContrastFormula;
}

export interface ContrastColorValue {
	name: string;
	contrast: number;
	value: string;
}

export interface ContrastColor {
	name: string;
	values: ContrastColorValue[];
}

export type ContrastColors = Array<{ background: string } | ContrastColor>;
export type ContrastColorPairs = Record<string, string>;
export type ContrastColorValues = string[];

export class Theme {
	private _output: LeonardoColorspace;
	private _colors: Color[];
	private _lightness: number;
	private _saturation: number;
	private _formula: ContrastFormula;
	private _backgroundColor!: BackgroundColor;
	private _backgroundColorValue: string;
	private _contrast: number;
	private _contrastColors: ContrastColors;
	private _contrastColorPairs: ContrastColorPairs;
	private _contrastColorValues: ContrastColorValues;

	constructor({
		colors,
		backgroundColor,
		lightness,
		contrast = 1,
		saturation = 100,
		output = "HEX",
		formula = "wcag2",
	}: ThemeOptions) {
		this._output = output;
		this._saturation = saturation;
		this._formula = formula;
		this._contrast = contrast;
		this._lightness = lightness ?? 100;
		this._backgroundColorValue = "";

		// Convert color inputs to Color instances
		this._colors = colors.map((color) => {
			if (color instanceof Color) {
				return color;
			}
			return new Color({
				...color,
				output: this._output,
				saturation: this._saturation,
			});
		});

		// Set up background color
		this._setBackgroundColor(backgroundColor);
		this._setBackgroundColorValue();

		// Validation
		if (!this._colors || this._colors.length === 0) {
			throw new Error("No colors are defined");
		}
		if (!this._backgroundColor) {
			throw new Error("Background color is undefined");
		}

		this._colors.forEach((color) => {
			if (!color.ratios) {
				throw new Error(`Color ${color.name}'s ratios are undefined`);
			}
		});

		if (!colorSpaces[this._output]) {
			throw new Error(`Output "${output}" not supported`);
		}

		// Update saturation if needed
		if (this._saturation < 100) {
			this._updateColorSaturation(this._saturation);
		}

		// Initialize contrast colors
		this._contrastColors = [];
		this._contrastColorPairs = {};
		this._contrastColorValues = [];

		// Generate contrast colors
		this._findContrastColors();
		this._findContrastColorPairs();
		this._findContrastColorValues();
	}

	// Getters and setters
	set formula(formula: ContrastFormula) {
		this._formula = formula;
		this._findContrastColors();
	}

	get formula(): ContrastFormula {
		return this._formula;
	}

	set contrast(contrast: number) {
		this._contrast = contrast;
		this._findContrastColors();
	}

	get contrast(): number {
		return this._contrast;
	}

	set lightness(lightness: number) {
		this._lightness = lightness;
		this._setBackgroundColor(this._backgroundColor);
		this._findContrastColors();
	}

	get lightness(): number {
		return this._lightness;
	}

	set saturation(saturation: number) {
		this._saturation = saturation;
		this._updateColorSaturation(saturation);
		this._findContrastColors();
	}

	get saturation(): number {
		return this._saturation;
	}

	set backgroundColor(backgroundColor: string | BackgroundColor | ThemeBackgroundInput) {
		this._setBackgroundColor(backgroundColor);
		this._findContrastColors();
	}

	get backgroundColorValue(): string {
		return this._backgroundColorValue;
	}

	get backgroundColor(): BackgroundColor {
		return this._backgroundColor;
	}

	set colors(colors: Color[]) {
		this._colors = colors;
		this._findContrastColors();
	}

	get colors(): Color[] {
		return this._colors;
	}

	set addColor(color: Color) {
		this._colors.push(color);
		this._findContrastColors();
	}

	set removeColor(color: { name: string }) {
		const filteredColors = this._colors.filter((entry) => entry.name !== color.name);
		this._colors = filteredColors;
		this._findContrastColors();
	}

	set updateColor(
		param:
			| {
					color: string;
					name?: string;
					colorKeys?: string[];
					ratios?: number[] | Record<string, number>;
					colorspace?: LeonardoColorspace;
					smooth?: boolean;
			  }
			| Array<{
					color: string;
					name?: string;
					colorKeys?: string[];
					ratios?: number[] | Record<string, number>;
					colorspace?: LeonardoColorspace;
					smooth?: boolean;
			  }>,
	) {
		if (Array.isArray(param)) {
			for (const p of param) {
				this._updateSingleColor(p);
			}
		} else {
			this._updateSingleColor(param);
		}
		this._findContrastColors();
	}

	private _updateSingleColor(param: {
		color: string;
		name?: string;
		colorKeys?: string[];
		ratios?: number[] | Record<string, number>;
		colorspace?: LeonardoColorspace;
		smooth?: boolean;
	}): void {
		const currentColor = this._colors.find((entry) => entry.name === param.color);
		if (!currentColor) return;

		const index = this._colors.indexOf(currentColor);
		const filteredColors = this._colors.filter((entry) => entry.name !== param.color);

		if (param.name) currentColor.name = param.name;
		if (param.colorKeys) currentColor.colorKeys = param.colorKeys;
		if (param.ratios) currentColor.ratios = param.ratios;
		if (param.colorspace) currentColor.colorspace = param.colorspace;
		if (param.smooth !== undefined) currentColor.smooth = param.smooth;

		currentColor._generateColorScale();

		filteredColors.splice(index, 0, currentColor);
		this._colors = filteredColors;
	}

	set output(output: LeonardoColorspace) {
		this._output = output;
		this._colors.forEach((element) => {
			element.output = this._output;
		});
		this._backgroundColor.output = this._output;
		this._findContrastColors();
	}

	get output(): LeonardoColorspace {
		return this._output;
	}

	get contrastColors(): ContrastColors {
		return this._contrastColors;
	}

	get contrastColorPairs(): ContrastColorPairs {
		return this._contrastColorPairs;
	}

	get contrastColorValues(): ContrastColorValues {
		return this._contrastColorValues;
	}

	private _setBackgroundColor(
		backgroundColor: string | BackgroundColor | ThemeBackgroundInput,
	): void {
		if (typeof backgroundColor === "string") {
			// String input - convert to BackgroundColor
			const newBackgroundColor = new BackgroundColor({
				name: "background",
				colorKeys: [backgroundColor],
				output: "RGB",
			});
			// Use Color.js HSLuv for lightness calculation
			const hsluvColor = new ColorJS(String(backgroundColor)).to("hsluv");
			const calcLightness = round(hsluvColor.coords[2] ?? 0);

			this._backgroundColor = newBackgroundColor;
			this._lightness = calcLightness;
			this._backgroundColorValue = (newBackgroundColor.backgroundColorScale[this._lightness] ?? "#ffffff");
		} else if (backgroundColor instanceof BackgroundColor) {
			backgroundColor.output = "RGB";
			const calcBackgroundColorValue =
				backgroundColor.backgroundColorScale[this._lightness] ?? "#ffffff";

			this._backgroundColor = backgroundColor;
			this._backgroundColorValue = calcBackgroundColorValue;
		} else {
			// ThemeBackgroundInput object
			const newBackgroundColor = new BackgroundColor({
				...backgroundColor,
				output: "RGB",
			});
			const calcBackgroundColorValue =
				newBackgroundColor.backgroundColorScale[this._lightness] ?? "#ffffff";

			this._backgroundColor = newBackgroundColor;
			this._backgroundColorValue = calcBackgroundColorValue;
		}
	}

	private _setBackgroundColorValue(): void {
		this._backgroundColorValue =
			this._backgroundColor.backgroundColorScale[this._lightness] ?? "#ffffff";
	}

	private _updateColorSaturation(saturation: number): void {
		this._colors.forEach((color) => {
			color.saturation = saturation;
		});
	}

	private _findContrastColors(): ContrastColors {
		// Use Color.js for RGB conversion
		const bgColor = new ColorJS(String(this._backgroundColorValue)).to("srgb");
		const bgRgbArray = [
			Math.round((bgColor.coords[0] ?? 0) * 255),
			Math.round((bgColor.coords[1] ?? 0) * 255),
			Math.round((bgColor.coords[2] ?? 0) * 255),
		];
		const baseV = this._lightness / 100;
		const convertedBackgroundColorValue = convertColorValue(
			this._backgroundColorValue,
			this._output,
		) as string;
		const baseObj = { background: convertedBackgroundColorValue };

		const returnColors: ContrastColors = [];
		const returnColorValues: ContrastColorValues = [];
		const returnColorPairs: ContrastColorPairs = { ...baseObj };
		returnColors.push(baseObj);

		this._colors.forEach((color) => {
			if (color.ratios !== undefined) {
				let swatchNames: string[] | undefined;
				const newArr: ContrastColorValue[] = [];
				const colorObj: ContrastColor = {
					name: color.name,
					values: newArr,
				};

				let ratioValues: number[];

				if (Array.isArray(color.ratios)) {
					ratioValues = color.ratios;
				} else {
					swatchNames = Object.keys(color.ratios);
					ratioValues = Object.values(color.ratios);
				}

				// Modify target ratios based on contrast multiplier
				ratioValues = ratioValues.map((ratio) =>
					multiplyRatios(+ratio, this._contrast),
				);

				const contrastColors = searchColors(
					color,
					bgRgbArray,
					baseV,
					ratioValues,
					this._formula,
				).map((clr) => convertColorValue(clr, this._output) as string);

				for (let i = 0; i < contrastColors.length; i++) {
					let n: string;
					if (!swatchNames) {
						const rVal = ratioName(
							Array.isArray(color.ratios)
								? color.ratios
								: Object.values(color.ratios),
							this._formula,
						)[i] ?? 0;
						n = color.name.concat(String(rVal)).replace(/\s+/g, "");
					} else {
						n = swatchNames[i] ?? "";
					}

					const obj: ContrastColorValue = {
						name: n,
						contrast: ratioValues[i] ?? 0,
						value: contrastColors[i] ?? "",
					};
					newArr.push(obj);
					returnColorPairs[n] = contrastColors[i] ?? "";
					returnColorValues.push(contrastColors[i] ?? "");
				}
				returnColors.push(colorObj);
			}
		});

		this._contrastColorValues = returnColorValues;
		this._contrastColorPairs = returnColorPairs;
		this._contrastColors = returnColors;
		return this._contrastColors;
	}

	private _findContrastColorPairs(): ContrastColorPairs {
		return this._contrastColorPairs;
	}

	private _findContrastColorValues(): ContrastColorValues {
		return this._contrastColorValues;
	}
}
