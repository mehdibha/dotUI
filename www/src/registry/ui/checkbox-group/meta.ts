import type { RegistryItem } from "@/registry/types";

const checkboxGroupMeta = {
	name: "checkbox-group",
	type: "registry:ui",
	group: "selection-controls",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/checkbox-group/base.tsx",
			target: "ui/checkbox-group.tsx",
		},
	],
	registryDependencies: ["field", "checkbox"],
} satisfies RegistryItem;

export default checkboxGroupMeta;

export type CheckboxGroupStyle = keyof typeof checkboxGroupMeta.styles;

export const checkboxGroupStyleNames = Object.keys(checkboxGroupMeta.styles) as CheckboxGroupStyle[];

export const defaultCheckboxGroupStyle = checkboxGroupMeta.defaultStyle;
