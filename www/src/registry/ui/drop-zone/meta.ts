import type { RegistryItem } from "@/registry/types";

const dropZoneMeta = {
	name: "drop-zone",
	type: "registry:ui",
	group: "forms",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/drop-zone/base.tsx",
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
