import type { RegistryItem } from "@/registry/types";

const checkboxMeta = {
	name: "checkbox",
	type: "registry:ui",
	group: "selection-controls",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	tokens: {
		"--checkbox-radius": {
			type: "radius",
			default: "--radius-sm",
		},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/checkbox/base.tsx",
			target: "ui/checkbox.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default checkboxMeta;

export type CheckboxStyle = keyof typeof checkboxMeta.styles;

export const checkboxStyleNames = Object.keys(checkboxMeta.styles) as CheckboxStyle[];

export const defaultCheckboxStyle = checkboxMeta.defaultStyle;
