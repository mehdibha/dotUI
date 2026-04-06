import type { RegistryItem } from "@/registry/types";

const switchMeta = {
	name: "switch",
	type: "registry:ui",
	group: "selections",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/switch/base.tsx",
			target: "ui/switch.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default switchMeta;

export type SwitchStyle = keyof typeof switchMeta.styles;

export const switchStyleNames = Object.keys(switchMeta.styles) as SwitchStyle[];

export const defaultSwitchStyle = switchMeta.defaultStyle;
