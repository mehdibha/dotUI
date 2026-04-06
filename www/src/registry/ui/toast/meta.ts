import type { RegistryItem } from "@/registry/types";

const toastMeta = {
	name: "toast",
	type: "registry:ui",
	group: "feedback",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/toast/base.tsx",
			target: "ui/toast.tsx",
		},
	],
} satisfies RegistryItem;

export default toastMeta;

export type ToastStyle = keyof typeof toastMeta.styles;

export const toastStyleNames = Object.keys(toastMeta.styles) as ToastStyle[];

export const defaultToastStyle = toastMeta.defaultStyle;
