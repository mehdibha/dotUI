import type { RegistryItem } from "@/registry/types";

const radioGroupMeta = {
	name: "radio-group",
	type: "registry:ui",
	group: "selection-controls",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/radio-group/base.tsx",
			target: "ui/radio-group.tsx",
		},
	],
	registryDependencies: ["focus-styles", "field"],
} satisfies RegistryItem;

export default radioGroupMeta;

export type RadioGroupStyle = keyof typeof radioGroupMeta.styles;

export const radioGroupStyleNames = Object.keys(radioGroupMeta.styles) as RadioGroupStyle[];

export const defaultRadioGroupStyle = radioGroupMeta.defaultStyle;
