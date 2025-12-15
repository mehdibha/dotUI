/**
 * Core types for @dotui/core
 */

// --------------------------------- Icon Types --------------------------------- //

export type IconLibrary = "lucide" | "remix";

export interface IconsConfig {
	library: IconLibrary;
	strokeWidth?: number;
}

// --------------------------------- Color Types --------------------------------- //

export interface ColorScaleConfig {
	/** Base color key(s) for the scale */
	colorKeys: string[];
	/** Target contrast ratios (11 values for 50-950 scale) */
	ratios?: number[];
	/** Use smooth Bezier interpolation */
	smooth?: boolean;
}

export interface ModeConfig {
	/** Background lightness (0-100) */
	lightness: number;
	/** Global saturation modifier (0-100) */
	saturation?: number;
	/** Global contrast multiplier */
	contrast?: number;
	/** Color scales */
	scales: {
		neutral: ColorScaleConfig;
		accent: ColorScaleConfig;
		success: ColorScaleConfig;
		warning: ColorScaleConfig;
		danger: ColorScaleConfig;
		info: ColorScaleConfig;
	};
}

export type ScaleId = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

export interface ColorsConfig {
	/** Active modes */
	activeModes: ("light" | "dark")[];
	/** Mode configurations */
	modes: {
		light: ModeConfig;
		dark: ModeConfig;
	};
	/** Background color for theme generation */
	backgroundColor: string;
}

// --------------------------------- Layout Types --------------------------------- //

export type Radius = number;
export type Spacing = number;

// --------------------------------- Typography Types --------------------------------- //

export interface FontsConfig {
	heading: string;
	body: string;
}

// --------------------------------- Theme Types --------------------------------- //

export interface ThemeConfig {
	colors: ColorsConfig;
	radius: Radius;
	spacing: Spacing;
	fonts: FontsConfig;
}

export interface ThemeOutput {
	cssVars: {
		light: Record<string, string>;
		dark?: Record<string, string>;
	};
}

// --------------------------------- Variants Types --------------------------------- //

/**
 * Direct component variant mapping
 * Each component maps to its selected variant name
 */
export interface Variants {
	accordion?: string;
	alert?: string;
	avatar?: string;
	badge?: string;
	breadcrumbs?: string;
	button?: string;
	calendar?: string;
	card?: string;
	checkbox?: string;
	"checkbox-group"?: string;
	"color-area"?: string;
	"color-editor"?: string;
	"color-field"?: string;
	"color-picker"?: string;
	"color-slider"?: string;
	"color-swatch"?: string;
	"color-swatch-picker"?: string;
	"color-thumb"?: string;
	combobox?: string;
	command?: string;
	"date-field"?: string;
	"date-picker"?: string;
	dialog?: string;
	disclosure?: string;
	drawer?: string;
	"drop-zone"?: string;
	empty?: string;
	field?: string;
	"file-trigger"?: string;
	"focus-styles"?: string;
	form?: string;
	group?: string;
	input?: string;
	kbd?: string;
	link?: string;
	"list-box"?: string;
	loader?: string;
	menu?: string;
	modal?: string;
	"number-field"?: string;
	overlay?: string;
	popover?: string;
	"progress-bar"?: string;
	"radio-group"?: string;
	"search-field"?: string;
	select?: string;
	separator?: string;
	skeleton?: string;
	slider?: string;
	switch?: string;
	table?: string;
	tabs?: string;
	"tag-group"?: string;
	text?: string;
	"text-field"?: string;
	"time-field"?: string;
	toast?: string;
	"toggle-button"?: string;
	"toggle-button-group"?: string;
	tooltip?: string;
}

// --------------------------------- Style Types --------------------------------- //

export interface StyleConfig {
	theme: ThemeConfig;
	icons: IconsConfig;
	variants: Variants;
}

export interface Style {
	theme: ThemeOutput;
	icons: IconsConfig;
	variants: Variants;
}
