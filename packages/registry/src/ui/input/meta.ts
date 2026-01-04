import type { RegistryItem } from "@dotui/registry/types";

const inputMeta = {
	name: "input",
	type: "registry:ui",
	group: "inputs",
	defaultVariant: "basic",
	variants: {
		basic: {
			files: [
				{
					type: "registry:ui",
					path: "ui/input/basic.tsx",
					target: "ui/input.tsx",
				},
			],
			registryDependencies: ["focus-styles"],
			dependencies: ["@react-stately/utils", "react-aria"],
		},
	},
} satisfies RegistryItem;

export default inputMeta;
export const inputVariants = Object.keys(inputMeta.variants) as (keyof typeof inputMeta.variants)[];

export type InputVariant = keyof typeof inputMeta.variants;

export const defaultInputVariant = inputMeta.defaultVariant;
