/**
 * Generate shadcn theme JSON
 */

import type { Style } from "../types";

export interface ShadcnTheme {
	name: string;
	type: "registry:style";
	cssVars: {
		light: Record<string, string>;
		dark?: Record<string, string>;
	};
}

/**
 * Generate shadcn-compatible theme JSON
 */
export function generateTheme(style: Style, styleName: string): ShadcnTheme {
	return {
		name: styleName,
		type: "registry:style",
		cssVars: {
			light: style.theme.cssVars.light,
			dark: style.theme.cssVars.dark,
		},
	};
}
