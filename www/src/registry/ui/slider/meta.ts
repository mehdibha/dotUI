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
				"value",
				"bar",
				"dots-vertical",
				"dots-horizontal",
				"arrows",
				"target",
				"raised",
				"ticks",
				"faceted",
			] as const,
			description: "Visual style of the slider thumb.",
		},
		"track-style": {
			kind: "enum",
			default: "line",
			values: ["line", "filled"] as const,
			description: "Visual style of the slider track.",
		},
	},
} satisfies RegistryItem;

export default sliderMeta;
