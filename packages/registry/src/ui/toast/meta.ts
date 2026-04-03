import type { RegistryItem } from "@dotui/registry/types";

const toastMeta = {
	name: "toast",
	type: "registry:ui",
	group: "feedback",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/toast/base.tsx",
					target: "ui/toast.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default toastMeta;
export const toastVariants = Object.keys(toastMeta.variants) as (keyof typeof toastMeta.variants)[];

export type ToastVariant = keyof typeof toastMeta.variants;

export const defaultToastVariant = toastMeta.defaultVariant;
