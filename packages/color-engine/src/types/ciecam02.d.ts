/**
 * Type declarations for ciecam02
 * https://github.com/baskerville/ciecam02
 */

declare module "ciecam02" {
	import type { Illuminant } from "ciebase";

	/** CIECAM02 viewing conditions */
	export interface ViewingConditions {
		/** White point illuminant */
		whitePoint: Illuminant;
		/** Adapting luminance (cd/m²), typically 40 */
		adaptingLuminance: number;
		/** Background luminance (% of white), typically 20 */
		backgroundLuminance: number;
		/** Surround type: 'average', 'dim', or 'dark' */
		surroundType: "average" | "dim" | "dark";
		/** Whether to discount the illuminant */
		discounting: boolean;
	}

	/** JCh color appearance correlates */
	export interface JChCorrelates {
		/** Lightness (0-100) */
		J: number;
		/** Chroma */
		C: number;
		/** Hue angle (0-360) */
		h: number;
	}

	/** Full CAM02 correlates */
	export interface CamCorrelates extends JChCorrelates {
		/** Colorfulness */
		M: number;
		/** Saturation */
		s: number;
		/** Hue composition */
		H: number;
		/** Brightness */
		Q: number;
	}

	/** CAM converter */
	export interface CamConverter<T = CamCorrelates> {
		fromXyz(xyz: { x: number; y: number; z: number }): T;
		toXyz(cam: T): { x: number; y: number; z: number };
	}

	/**
	 * Correlate filter string
	 * @example 'JCh' for J, C, h correlates only
	 */
	export function cfs(correlates: string): string;

	/**
	 * Create CAM converter with viewing conditions
	 * @param conditions - Viewing conditions
	 * @param correlates - Optional correlate filter (from cfs())
	 */
	export function cam(conditions: ViewingConditions, correlates?: string): CamConverter<JChCorrelates>;

	/**
	 * Create gamut mapping for a colorspace and CAM
	 */
	export function gamut(xyz: unknown, cam: CamConverter): unknown;
}
