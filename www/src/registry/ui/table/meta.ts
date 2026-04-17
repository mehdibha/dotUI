import type { RegistryItem } from "@/registry/types";

const tableMeta = {
	name: "table",
	type: "registry:ui",
	group: "containers",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/table/base.tsx",
			target: "ui/table.tsx",
		},
	],
	registryDependencies: ["checkbox", "focus-styles"],
} satisfies RegistryItem;

export default tableMeta;

export type TableStyle = keyof typeof tableMeta.styles;

export const tableStyleNames = Object.keys(tableMeta.styles) as TableStyle[];

export const defaultTableStyle = tableMeta.defaultStyle;
