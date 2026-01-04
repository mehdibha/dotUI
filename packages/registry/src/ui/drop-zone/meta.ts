import type { RegistryItem } from "@dotui/registry/types";

const dropZoneMeta = {
	name: "drop-zone",
	type: "registry:ui",
	group: "forms",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/drop-zone/basic.tsx",
					target: "ui/drop-zone.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default dropZoneMeta;
export const dropZoneVariants = Object.keys(dropZoneMeta.variants) as (keyof typeof dropZoneMeta.variants)[];

export type DropZoneVariant = keyof typeof dropZoneMeta.variants;

export const defaultDropZoneVariant = dropZoneMeta.defaultVariant;
