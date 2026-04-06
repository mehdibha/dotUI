import type { RegistryItem } from "@/registry/types";

const dropZoneMeta = {
	name: "drop-zone",
	type: "registry:ui",
	group: "forms",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/drop-zone/base.tsx",
			target: "ui/drop-zone.tsx",
		},
	],
} satisfies RegistryItem;

export default dropZoneMeta;

export type DropZoneStyle = keyof typeof dropZoneMeta.styles;

export const dropZoneStyleNames = Object.keys(dropZoneMeta.styles) as DropZoneStyle[];

export const defaultDropZoneStyle = dropZoneMeta.defaultStyle;
