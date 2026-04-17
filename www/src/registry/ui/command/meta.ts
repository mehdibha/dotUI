import type { RegistryItem } from "@/registry/types";

const commandMeta = {
	name: "command",
	type: "registry:ui",
	group: "menus-lists",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/command/base.tsx",
			target: "ui/command.tsx",
		},
	],
} satisfies RegistryItem;

export default commandMeta;

export type CommandStyle = keyof typeof commandMeta.styles;

export const commandStyleNames = Object.keys(commandMeta.styles) as CommandStyle[];

export const defaultCommandStyle = commandMeta.defaultStyle;
