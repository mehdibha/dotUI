import type { RegistryItem } from "@dotui/registry/types";

const timeFieldMeta = {
	name: "time-field",
	type: "registry:ui",
	group: "inputs",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/time-field/basic.tsx",
					target: "ui/time-field.tsx",
				},
			],
			registryDependencies: ["field", "input"],
		},
	},
} satisfies RegistryItem;

export default timeFieldMeta;
export const timeFieldVariants = Object.keys(timeFieldMeta.variants) as (keyof typeof timeFieldMeta.variants)[];

export type TimeFieldVariant = keyof typeof timeFieldMeta.variants;

export const defaultTimeFieldVariant = timeFieldMeta.defaultVariant;
