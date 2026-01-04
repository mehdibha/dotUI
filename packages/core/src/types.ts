/**
 * Runtime types for style system
 * These are the resolved/processed types used at runtime
 */

// --------------------------------- Utility Types --------------------------------- //

export type Css = Record<string, string | Record<string, string | Record<string, string>>>;

// --------------------------------- Icon Types --------------------------------- //

export type IconLibrary = string;

export interface IconsDefinition {
	library: IconLibrary;
	strokeWidth: number;
}

// --------------------------------- Color Types --------------------------------- //

export type ColorFormat = "oklch" | "hex" | "hsl";

// --------------------------------- Theme Types --------------------------------- //

export interface Theme {
	css?: Css;
	cssVars: {
		light: Record<string, string>;
		dark?: Record<string, string>;
		theme: Record<string, string>;
	};
}

// --------------------------------- Variant Types --------------------------------- //

/**
 * Variants is the processed/resolved variant mapping for all components
 */
export interface Variants {
	[key: string]: string;
}

// --------------------------------- Style Types --------------------------------- //

export interface Style {
	theme: Theme;
	icons: IconsDefinition;
	variants: Variants;
}
