import type { RegistryItem } from "@/registry/types";

const toggleButtonMeta = {
	name: "toggle-button",
	type: "registry:ui",
	group: "buttons",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/toggle-button/base.tsx",
			target: "ui/toggle-button.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default toggleButtonMeta;

export type ToggleButtonStyle = keyof typeof toggleButtonMeta.styles;

export const toggleButtonStyleNames = Object.keys(toggleButtonMeta.styles) as ToggleButtonStyle[];

export const defaultToggleButtonStyle = toggleButtonMeta.defaultStyle;
