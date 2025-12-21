/**
 * Shared output types for both Material and Contrast themes
 */

/** 11-step color scale (50-950) */
export type ColorScale = {
	"50": string;
	"100": string;
	"200": string;
	"300": string;
	"400": string;
	"500": string;
	"600": string;
	"700": string;
	"800": string;
	"900": string;
	"950": string;
};

/** A single mode's output */
export type ThemeMode = {
	scales: Record<string, ColorScale>;
};

/** Complete theme output with multiple modes */
export type Theme = Record<string, ThemeMode>;
