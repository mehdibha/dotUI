import type { RegistryItem } from "@dotui/registry/types";

const formMeta = {
	name: "form",
	type: "registry:ui",
	group: "forms",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/form/base.tsx",
					target: "ui/form.tsx",
				},
			],
		},
		"react-hook-form": {
			files: [
				{
					type: "registry:ui",
					path: "ui/form/react-hook-form.tsx",
					target: "ui/form.tsx",
				},
			],
			dependencies: ["react-hook-form"],
		},
	},
} satisfies RegistryItem;

export default formMeta;
export const formVariants = Object.keys(formMeta.variants) as (keyof typeof formMeta.variants)[];

export type ReactHookFormVariant = keyof typeof formMeta.variants;

export const defaultReactHookFormVariant = formMeta.defaultVariant;
