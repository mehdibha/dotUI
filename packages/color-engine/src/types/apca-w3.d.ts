/**
 * Type declarations for apca-w3
 * https://github.com/nicholastsui/apca-w3
 */

declare module "apca-w3" {
	/**
	 * Calculate APCA contrast between two colors
	 * @param textY - Luminance of text color
	 * @param bgY - Luminance of background color
	 * @returns APCA contrast value (roughly -108 to 106)
	 */
	export function APCAcontrast(textY: number, bgY: number): number;

	/**
	 * Convert sRGB color to Y (luminance)
	 * @param rgb - RGB array [r, g, b] where values are 0-255
	 * @returns Luminance value
	 */
	export function sRGBtoY(rgb: [number, number, number]): number;

	/**
	 * Calculate contrast from hex colors
	 * @param textColor - Text color as hex string
	 * @param bgColor - Background color as hex string
	 * @returns APCA contrast value
	 */
	export function calcAPCA(textColor: string, bgColor: string): number;
}
