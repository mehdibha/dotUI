import type { RegistryItem } from "@/registry/types";

const progressBarMeta = {
	name: "progress-bar",
	type: "registry:ui",
	group: "progress",
	files: [
		{
			type: "registry:ui",
			path: "ui/progress-bar/base.tsx",
			target: "ui/progress-bar.tsx",
		},
	],
	registryDependencies: ["field"],
	params: {
		"track-size": {
			kind: "scalar",
			type: "spacing",
			cssVar: "--progress-track-size",
			default: "calc(var(--spacing) * 1)",
			minValue: 1,
			maxValue: 7,
			step: 0.25,
			// description: "Thickness of the progress track.",
		},
		"track-radius": {
			kind: "scalar",
			type: "radius",
			cssVar: "--progress-track-radius",
			default: "--radius-full",
			// description: "Radius of the progress track.",
		},
		"fill-color": {
			kind: "scalar",
			type: "color",
			cssVar: "--progress-fill-color",
			default: "--color-primary",
			// description: "Color of the progress fill.",
		},
	},
} satisfies RegistryItem;

export default progressBarMeta;
