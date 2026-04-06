import type { RegistryItem } from "@/registry/types";

const toggleButtonGroupMeta = {
	name: "toggle-button-group",
	type: "registry:ui",
	group: "buttons",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/toggle-button-group/base.tsx",
			target: "ui/toggle-button-group.tsx",
		},
	],
	registryDependencies: ["toggle-button"],
} satisfies RegistryItem;

export default toggleButtonGroupMeta;

export type ToggleButtonGroupStyle = keyof typeof toggleButtonGroupMeta.styles;

export const toggleButtonGroupStyleNames = Object.keys(toggleButtonGroupMeta.styles) as ToggleButtonGroupStyle[];

export const defaultToggleButtonGroupStyle = toggleButtonGroupMeta.defaultStyle;
