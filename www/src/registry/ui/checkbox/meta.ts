import type { RegistryItem } from "@/registry/types";

const checkboxMeta = {
	name: "checkbox",
	type: "registry:ui",
	group: "selections",
	defaultStyle: "default",
	styles: {
		default: {},
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
