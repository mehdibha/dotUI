import type { RegistryItem } from "@/registry/types";

const disclosureMeta = {
	name: "disclosure",
	type: "registry:ui",
	group: "disclosure",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/disclosure/base.tsx",
			target: "ui/disclosure.tsx",
		},
	],
} satisfies RegistryItem;

export default disclosureMeta;

export type DisclosureStyle = keyof typeof disclosureMeta.styles;

export const disclosureStyleNames = Object.keys(disclosureMeta.styles) as DisclosureStyle[];

export const defaultDisclosureStyle = disclosureMeta.defaultStyle;
