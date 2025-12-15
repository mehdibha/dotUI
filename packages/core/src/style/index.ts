/**
 * Style module - creates Style from StyleConfig
 */

import type { StyleConfig, Style, Variants } from "../types";
import { generateTheme, themeToCss } from "./theme";

/**
 * Default variants for components (all use "basic" variant)
 */
const DEFAULT_VARIANTS: Variants = {
	accordion: "basic",
	alert: "basic",
	avatar: "basic",
	badge: "basic",
	breadcrumbs: "basic",
	button: "basic",
	calendar: "basic",
	card: "basic",
	checkbox: "basic",
	"checkbox-group": "basic",
	"color-area": "basic",
	"color-editor": "basic",
	"color-field": "basic",
	"color-picker": "basic",
	"color-slider": "basic",
	"color-swatch": "basic",
	"color-swatch-picker": "basic",
	"color-thumb": "basic",
	combobox: "basic",
	command: "basic",
	"date-field": "basic",
	"date-picker": "basic",
	dialog: "basic",
	disclosure: "basic",
	drawer: "basic",
	"drop-zone": "basic",
	empty: "basic",
	field: "basic",
	"file-trigger": "basic",
	"focus-styles": "basic",
	form: "basic",
	group: "basic",
	input: "basic",
	kbd: "basic",
	link: "basic",
	"list-box": "basic",
	loader: "basic",
	menu: "basic",
	modal: "basic",
	"number-field": "basic",
	overlay: "basic",
	popover: "basic",
	"progress-bar": "basic",
	"radio-group": "basic",
	"search-field": "basic",
	select: "basic",
	separator: "basic",
	skeleton: "basic",
	slider: "basic",
	switch: "basic",
	table: "basic",
	tabs: "basic",
	"tag-group": "basic",
	text: "basic",
	"text-field": "basic",
	"time-field": "basic",
	toast: "basic",
	"toggle-button": "basic",
	"toggle-button-group": "basic",
	tooltip: "basic",
};

/**
 * Create a Style from StyleConfig
 */
export function createStyle(config: StyleConfig): Style {
	const theme = generateTheme(config.theme);

	// Merge user variants with defaults
	const variants: Variants = {
		...DEFAULT_VARIANTS,
		...config.variants,
	};

	return {
		theme,
		icons: config.icons,
		variants,
	};
}

// Re-export theme utilities
export { generateTheme, themeToCss } from "./theme";
