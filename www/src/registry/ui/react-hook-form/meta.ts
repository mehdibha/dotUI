import type { RegistryItem } from "@/registry/types";

const formMeta = {
	name: "form",
	type: "registry:ui",
	group: "forms",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/react-hook-form/base.tsx",
			target: "ui/react-hook-form.tsx",
		},
	],
} satisfies RegistryItem;

export default formMeta;

export type FormStyle = keyof typeof formMeta.styles;

export const formStyleNames = Object.keys(formMeta.styles) as FormStyle[];

export const defaultFormStyle = formMeta.defaultStyle;
