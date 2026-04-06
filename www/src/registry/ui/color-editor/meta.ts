import type { RegistryItem } from "@/registry/types";

const colorEditorMeta = {
	name: "color-editor",
	type: "registry:ui",
	group: "color",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/color-editor/base.tsx",
			target: "ui/color-editor.tsx",
		},
	],
	registryDependencies: ["color-area", "color-slider", "select"],
} satisfies RegistryItem;

export default colorEditorMeta;

export type ColorEditorStyle = keyof typeof colorEditorMeta.styles;

export const colorEditorStyleNames = Object.keys(colorEditorMeta.styles) as ColorEditorStyle[];

export const defaultColorEditorStyle = colorEditorMeta.defaultStyle;
