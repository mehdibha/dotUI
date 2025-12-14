/**
 * Type declarations for hsluv
 * https://github.com/hsluv/hsluv
 */

declare module "hsluv" {
	/**
	 * Convert HSLuv to RGB
	 * @param tuple - [H, S, L] where H is 0-360, S is 0-100, L is 0-100
	 * @returns [R, G, B] where values are 0-1
	 */
	export function hsluvToRgb(tuple: [number, number, number]): [number, number, number];

	/**
	 * Convert RGB to HSLuv
	 * @param tuple - [R, G, B] where values are 0-1
	 * @returns [H, S, L] where H is 0-360, S is 0-100, L is 0-100
	 */
	export function rgbToHsluv(tuple: [number, number, number]): [number, number, number];

	/**
	 * Convert HPLuv to RGB
	 * @param tuple - [H, P, L]
	 * @returns [R, G, B] where values are 0-1
	 */
	export function hpluvToRgb(tuple: [number, number, number]): [number, number, number];

	/**
	 * Convert RGB to HPLuv
	 * @param tuple - [R, G, B] where values are 0-1
	 * @returns [H, P, L]
	 */
	export function rgbToHpluv(tuple: [number, number, number]): [number, number, number];

	/**
	 * Convert HSLuv to hex
	 * @param tuple - [H, S, L]
	 * @returns Hex color string
	 */
	export function hsluvToHex(tuple: [number, number, number]): string;

	/**
	 * Convert hex to HSLuv
	 * @param hex - Hex color string
	 * @returns [H, S, L]
	 */
	export function hexToHsluv(hex: string): [number, number, number];

	/**
	 * Convert HPLuv to hex
	 * @param tuple - [H, P, L]
	 * @returns Hex color string
	 */
	export function hpluvToHex(tuple: [number, number, number]): string;

	/**
	 * Convert hex to HPLuv
	 * @param hex - Hex color string
	 * @returns [H, P, L]
	 */
	export function hexToHpluv(hex: string): [number, number, number];
}
