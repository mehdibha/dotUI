import type { RegistryItem } from "@/registry/types";

const commandMeta = {
	name: "command",
	type: "registry:ui",
	group: "overlays",
	defaultVariant: "base",
	variants: {
		base: {
			files: [
				{
					type: "registry:ui",
					path: "ui/command/base.tsx",
					target: "ui/command.tsx",
				},
			],
		},
	},
} satisfies RegistryItem;

export default commandMeta;
export const commandVariants = Object.keys(commandMeta.variants) as (keyof typeof commandMeta.variants)[];

export type CommandVariant = keyof typeof commandMeta.variants;

export const defaultCommandVariant = commandMeta.defaultVariant;
