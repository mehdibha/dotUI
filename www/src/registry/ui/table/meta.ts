import type { RegistryItem } from "@/registry/types";

const tableMeta = {
	name: "table",
	type: "registry:ui",
	group: "data-display",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/table/base.tsx",
					target: "ui/table.tsx",
				},
			],
			registryDependencies: ["checkbox", "focus-styles"],
		},
	},
} satisfies RegistryItem;

export default tableMeta;
export const tableVariants = Object.keys(tableMeta.variants) as (keyof typeof tableMeta.variants)[];

export type TableVariant = keyof typeof tableMeta.variants;

export const defaultTableVariant = tableMeta.defaultVariant;
