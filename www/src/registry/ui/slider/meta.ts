import type { RegistryItem } from "@/registry/types";

const sliderMeta = {
	name: "slider",
	type: "registry:ui",
	group: "sliders",
	files: [
		{
			type: "registry:ui",
			path: "ui/slider/base.tsx",
			target: "ui/slider.tsx",
		},
	],
	registryDependencies: ["field", "focus-styles"],
	dependencies: ["react-aria"],
	params: {
		"thumb-style": {
			kind: "enum",
			default: "raised",
			values: [
				"square",
				"solid",
				"outline",
				"subtle",
				"ring",
				"bar",
				"dots-vertical",
				"dots-horizontal",
				"arrows",
				"target",
				"raised",
				"ticks",
				"faceted",
			] as const,
			// description: "Visual style of the slider thumb.",
		},
		"fill-color": {
			kind: "scalar",
			type: "color",
			cssVar: "--slider-fill-color",
			default: "--color-primary",
			// description: "Color of the slider fill.",
		},
		radius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--slider-track-radius",
			default: "--radius-full",
			// description: "Radius of the slider track.",
		},
		size: {
			kind: "scalar",
			type: "spacing",
			cssVar: "--slider-size",
			default: "0.25rem",
			// description: "Thickness of the slider track.",
		},
	},
} satisfies RegistryItem;

export default sliderMeta;
