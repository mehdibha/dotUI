import type { RegistryItem } from "@dotui/registry/types";

const modalMeta = {
	name: "modal",
	type: "registry:ui",
	group: "overlays",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/modal/base.tsx",
					target: "ui/modal.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default modalMeta;
export const modalVariants = Object.keys(modalMeta.variants) as (keyof typeof modalMeta.variants)[];

export type ModalVariant = keyof typeof modalMeta.variants;

export const defaultModalVariant = modalMeta.defaultVariant;
