/**
 * Color class for Leonardo theme generation
 * Ported from Adobe's contrast-colors library for 100% Leonardo parity
 * Migrated to Color.js from chroma-js
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import ColorJS from "colorjs.io";
import { colorSpaces, createScale } from "./utils";
import type { LeonardoColorspace } from "../../types";

export interface ColorOptions {
	name: string;
	colorKeys: string[];
	colorspace?: LeonardoColorspace;
	ratios: number[] | Record<string, number>;
	smooth?: boolean;
	output?: LeonardoColorspace;
	saturation?: number;
}

export class Color {
	private _name: string;
	private _colorKeys: string[];
	_modifiedKeys: string[];
	_colorspace: LeonardoColorspace;
	private _ratios: number[] | Record<string, number>;
	_smooth: boolean;
	private _output: LeonardoColorspace;
	private _saturation: number;
	private _colorScale: ((pos: number) => string) | null;

	constructor({
		name,
		colorKeys,
		colorspace = "RGB",
		ratios,
		smooth = false,
		output = "HEX",
		saturation = 100,
	}: ColorOptions) {
		this._name = name;
		this._colorKeys = colorKeys;
		this._modifiedKeys = colorKeys;
		this._colorspace = colorspace;
		this._ratios = ratios;
		this._smooth = smooth;
		this._output = output;
		this._saturation = saturation;

		if (!this._name) {
			throw new Error("Color missing name");
		}
		if (!this._colorKeys) {
			throw new Error("Color Keys are undefined");
		}
		if (!colorSpaces[this._colorspace]) {
			throw new Error(`Colorspace "${colorspace}" not supported`);
		}
		if (!colorSpaces[this._output]) {
			throw new Error(`Output "${output}" not supported`);
		}

		// Validate color keys using Color.js
		for (let i = 0; i < this._colorKeys.length; i++) {
			try {
				new ColorJS(this._colorKeys[i]!);
			} catch {
				throw new Error(`Invalid Color Key "${this._colorKeys[i]}"`);
			}
		}

		this._colorScale = null;

		// Initialize saturation modification if needed
		if (this._saturation !== 100) {
			this._updateColorSaturation();
		}
	}

	// Getters and setters
	set colorKeys(colorKeys: string[]) {
		this._colorKeys = colorKeys;
		this._updateColorSaturation();
	}

	get colorKeys(): string[] {
		return this._colorKeys;
	}

	set saturation(saturation: number) {
		this._saturation = saturation;
		this._updateColorSaturation();
	}

	get saturation(): number {
		return this._saturation;
	}

	set colorspace(colorspace: LeonardoColorspace) {
		this._colorspace = colorspace;
		this._generateColorScale();
	}

	get colorspace(): LeonardoColorspace {
		return this._colorspace;
	}

	set ratios(ratios: number[] | Record<string, number>) {
		this._ratios = ratios;
	}

	get ratios(): number[] | Record<string, number> {
		return this._ratios;
	}

	set name(name: string) {
		this._name = name;
	}

	get name(): string {
		return this._name;
	}

	set smooth(smooth: boolean) {
		if (smooth === true || (smooth as any) === "true") {
			this._smooth = true;
		} else {
			this._smooth = false;
		}
		this._generateColorScale();
	}

	get smooth(): boolean {
		return this._smooth;
	}

	set output(output: LeonardoColorspace) {
		this._output = output;
		this._colorScale = null;
	}

	get output(): LeonardoColorspace {
		return this._output;
	}

	get colorScale(): (pos: number) => string {
		if (!this._colorScale) {
			this._generateColorScale();
		}
		return this._colorScale!;
	}

	/**
	 * Update color keys with saturation modification using OKLCH
	 * This is the key to Leonardo parity - uses OKLCH for saturation adjustment
	 */
	_updateColorSaturation(): void {
		const newColorKeys: string[] = [];

		this._colorKeys.forEach((key) => {
			const color = new ColorJS(key).to("oklch");
			const currentL = color.coords[0] ?? 0;
			const currentC = color.coords[1] ?? 0;
			const currentH = color.coords[2] ?? 0;
			const newSaturation = currentC * (this._saturation / 100);
			const newColor = new ColorJS("oklch", [currentL, newSaturation, currentH]);
			newColorKeys.push(newColor.to("srgb").toString({ format: "hex" }));
		});

		this._modifiedKeys = newColorKeys;
		this._generateColorScale();
	}

	/**
	 * Generate the color scale (3000 swatches)
	 */
	_generateColorScale(): void {
		this._colorScale = createScale({
			swatches: 3000,
			colorKeys: this._modifiedKeys,
			colorspace: this._colorspace,
			shift: 1,
			smooth: this._smooth,
			asFun: true,
		}) as (pos: number) => string;
	}
}
