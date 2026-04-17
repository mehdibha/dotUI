import type { RegistryItem } from "@/registry/types";

const comboboxMeta = {
	name: "combobox",
	type: "registry:ui",
	group: "pickers",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/combobox/base.tsx",
			target: "ui/combobox.tsx",
		},
	],
	registryDependencies: ["field", "button", "input", "list-box", "overlay"],
} satisfies RegistryItem;

export default comboboxMeta;

export type ComboboxStyle = keyof typeof comboboxMeta.styles;

export const comboboxStyleNames = Object.keys(comboboxMeta.styles) as ComboboxStyle[];

export const defaultComboboxStyle = comboboxMeta.defaultStyle;
