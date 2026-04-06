import type { RegistryItem } from "@/registry/types";

const dialogMeta = {
	name: "dialog",
	type: "registry:ui",
	group: "overlays",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/dialog/base.tsx",
			target: "ui/dialog.tsx",
		},
	],
	registryDependencies: ["overlay"],
} satisfies RegistryItem;

export default dialogMeta;

export type DialogStyle = keyof typeof dialogMeta.styles;

export const dialogStyleNames = Object.keys(dialogMeta.styles) as DialogStyle[];

export const defaultDialogStyle = dialogMeta.defaultStyle;
