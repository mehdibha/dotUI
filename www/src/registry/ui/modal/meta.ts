import type { RegistryItem } from "@/registry/types";

const modalMeta = {
	name: "modal",
	type: "registry:ui",
	group: "overlays",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/modal/base.tsx",
			target: "ui/modal.tsx",
		},
	],
} satisfies RegistryItem;

export default modalMeta;

export type ModalStyle = keyof typeof modalMeta.styles;

export const modalStyleNames = Object.keys(modalMeta.styles) as ModalStyle[];

export const defaultModalStyle = modalMeta.defaultStyle;
