import type { RegistryItem } from "@/registry/types";

const selectMeta = {
	name: "select",
	type: "registry:ui",
	group: "selections",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/select/base.tsx",
			target: "ui/select.tsx",
		},
	],
	registryDependencies: ["button", "field", "list-box", "popover"],
} satisfies RegistryItem;

export default selectMeta;

export type SelectStyle = keyof typeof selectMeta.styles;

export const selectStyleNames = Object.keys(selectMeta.styles) as SelectStyle[];

export const defaultSelectStyle = selectMeta.defaultStyle;
