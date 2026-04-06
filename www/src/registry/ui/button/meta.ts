import type { RegistryItem } from "@/registry/types";

const buttonMeta = {
	name: "button",
	type: "registry:ui",
	group: "buttons",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/button/base.tsx",
			target: "ui/button.tsx",
		},
	],
	registryDependencies: ["loader", "focus-styles"],
} satisfies RegistryItem;

export default buttonMeta;

export type ButtonStyle = keyof typeof buttonMeta.styles;

export const buttonStyleNames = Object.keys(buttonMeta.styles) as ButtonStyle[];

export const defaultButtonStyle = buttonMeta.defaultStyle;
