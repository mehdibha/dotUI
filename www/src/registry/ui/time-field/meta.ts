import type { RegistryItem } from "@/registry/types";

const timeFieldMeta = {
	name: "time-field",
	type: "registry:ui",
	group: "inputs",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/time-field/base.tsx",
			target: "ui/time-field.tsx",
		},
	],
	registryDependencies: ["field", "input"],
} satisfies RegistryItem;

export default timeFieldMeta;

export type TimeFieldStyle = keyof typeof timeFieldMeta.styles;

export const timeFieldStyleNames = Object.keys(timeFieldMeta.styles) as TimeFieldStyle[];

export const defaultTimeFieldStyle = timeFieldMeta.defaultStyle;
