import type { StyleConfig } from "@dotui/core/schemas";

/**
 * Default style configuration
 */
export const DEFAULT_STYLE: StyleConfig = {
	theme: {
		colors: {
			algorithm: "material",
			palettes: {
				primary: "#0091FF",
				neutral: "#8B8D98",
			},
			modes: {
				light: true,
				dark: true,
			},
		},
		radius: 1,
		spacing: 0.25,
		typography: {
			font: "Inter",
		},
	},
	icons: {
		library: "lucide",
		strokeWidth: 2,
	},
	variants: {},
};

/**
 * Default theme configuration (alias for DEFAULT_STYLE.theme)
 */
export const DEFAULT_THEME = DEFAULT_STYLE.theme;
