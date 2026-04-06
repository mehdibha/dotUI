import type { RegistryItem } from "@/registry/types";

const inputMeta = {
	name: "input",
	type: "registry:ui",
	group: "inputs",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/input/base.tsx",
			target: "ui/input.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
	dependencies: ["@react-stately/utils", "react-aria"],
} satisfies RegistryItem;

export default inputMeta;

export type InputStyle = keyof typeof inputMeta.styles;

export const inputStyleNames = Object.keys(inputMeta.styles) as InputStyle[];

export const defaultInputStyle = inputMeta.defaultStyle;
