/**
 * BackgroundColor class for Leonardo theme generation
 * Ported from Adobe's contrast-colors library for 100% Leonardo parity
 */

import { Color, ColorOptions } from "./color";
import { hsluvArray, convertColorValue, createScale, removeDuplicates } from "./utils";
import type { LeonardoColorspace } from "../../types";

export interface BackgroundColorOptions extends Omit<ColorOptions, "ratios"> {
	ratios?: number[] | Record<string, number>;
}

export class BackgroundColor extends Color {
	private _backgroundColorScale: string[] | null = null;

	constructor(options: BackgroundColorOptions) {
		// BackgroundColor doesn't require ratios
		super({
			...options,
			ratios: options.ratios || [],
		});
	}

	get backgroundColorScale(): string[] {
		if (!this._backgroundColorScale) {
			this._generateColorScale();
		}
		return this._backgroundColorScale!;
	}

	/**
	 * Generate the background color scale (100 lightness steps)
	 */
	_generateColorScale(): void {
		// Call parent's generateColorScale first
		super._generateColorScale();

		// Create massive scale for background
		const backgroundColorScale = createScale({
			swatches: 1000,
			colorKeys: this.colorKeys,
			colorspace: this.colorspace,
			shift: 1,
			smooth: this.smooth,
		}) as string[];

		// Inject original key colors to ensure they are present
		backgroundColorScale.push(...this.colorKeys);

		// Convert to HSLuv and track indices
		const colorObj = backgroundColorScale.map((c, i) => ({
			value: Math.round(hsluvArray(c)[2] ?? 0),
			index: i,
		}));

		// Remove duplicates by lightness value
		const colorObjFiltered = removeDuplicates(colorObj, "value");

		// Map back to colors
		const bgColorArrayFiltered = colorObjFiltered.map(
			(data) => backgroundColorScale[data.index],
		);

		// Cap at 100 colors, add white back if needed
		if (bgColorArrayFiltered.length >= 101) {
			bgColorArrayFiltered.length = 100;
			bgColorArrayFiltered.push("#ffffff");
		}

		// Convert to output format
		this._backgroundColorScale = bgColorArrayFiltered.map((color) =>
			convertColorValue(color ?? "#ffffff", this.output) as string,
		);
	}
}
