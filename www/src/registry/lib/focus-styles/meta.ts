import type { RegistryItem } from "@/registry/types";

const focusStylesMeta = {
	name: "focus-styles",
	type: "registry:lib",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			path: "lib/focus-styles/basic.ts",
			type: "registry:lib",
			target: "lib/focus-styles.ts",
		},
	],
} satisfies RegistryItem;

export default focusStylesMeta;

export type FocusStylesStyle = keyof typeof focusStylesMeta.styles;

export const focusStylesStyleNames = Object.keys(focusStylesMeta.styles) as FocusStylesStyle[];

export const defaultFocusStylesStyle = focusStylesMeta.defaultStyle;
