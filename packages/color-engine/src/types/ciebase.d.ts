/**
 * Type declarations for ciebase
 * https://github.com/nickshanks/ciebase
 */

declare module "ciebase" {
	/** XYZ illuminant values */
	export interface Illuminant {
		x: number;
		y: number;
		z: number;
	}

	/** Standard illuminants */
	export const illuminant: {
		D50: Illuminant;
		D55: Illuminant;
		D65: Illuminant;
		D75: Illuminant;
	};

	/** Color workspace */
	export interface Workspace {
		toXyz: number[][];
		fromXyz: number[][];
		gamma: number;
	}

	/** Standard workspaces */
	export const workspace: {
		sRGB: Workspace;
		AdobeRGB: Workspace;
		AppleRGB: Workspace;
	};

	/** RGB conversion utilities */
	export const rgb: {
		fromHex(hex: string): [number, number, number];
		toHex(rgb: [number, number, number]): string;
	};

	/** XYZ colorspace converter */
	export interface XyzConverter {
		fromRgb(rgb: [number, number, number]): { x: number; y: number; z: number };
		toRgb(xyz: { x: number; y: number; z: number }): [number, number, number];
	}

	/** Create XYZ converter for a workspace and illuminant */
	export function xyz(workspace: Workspace, illuminant: Illuminant): XyzConverter;
}
