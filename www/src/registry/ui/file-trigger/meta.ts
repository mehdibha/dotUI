import type { RegistryItem } from "@/registry/types";

const fileTriggerMeta = {
	name: "file-trigger",
	type: "registry:ui",
	group: "buttons",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/file-trigger/base.tsx",
			target: "ui/file-trigger.tsx",
		},
	],
} satisfies RegistryItem;

export default fileTriggerMeta;

export type FileTriggerStyle = keyof typeof fileTriggerMeta.styles;

export const fileTriggerStyleNames = Object.keys(fileTriggerMeta.styles) as FileTriggerStyle[];

export const defaultFileTriggerStyle = fileTriggerMeta.defaultStyle;
