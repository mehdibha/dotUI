import type { RegistryItem } from "@/registry/types";

const progressBarMeta = {
	name: "progress-bar",
	type: "registry:ui",
	group: "progress",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/progress-bar/base.tsx",
			target: "ui/progress-bar.tsx",
		},
	],
	registryDependencies: ["field"],
} satisfies RegistryItem;

export default progressBarMeta;

export type ProgressBarStyle = keyof typeof progressBarMeta.styles;

export const progressBarStyleNames = Object.keys(progressBarMeta.styles) as ProgressBarStyle[];

export const defaultProgressBarStyle = progressBarMeta.defaultStyle;
