import type { RegistryItem } from "@dotui/registry/types";

const checkboxMeta = {
	name: "checkbox",
	type: "registry:ui",
	group: "selections",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/checkbox/basic.tsx",
					target: "ui/checkbox.tsx",
				},
			],
			registryDependencies: ["focus-styles"],
		},
	},
} satisfies RegistryItem;

export default checkboxMeta;
export const checkboxVariants = Object.keys(checkboxMeta.variants) as (keyof typeof checkboxMeta.variants)[];

export type CheckboxVariant = keyof typeof checkboxMeta.variants;

export const defaultCheckboxVariant = checkboxMeta.defaultVariant;
