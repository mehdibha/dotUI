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
			default: "solid",
			values: ["solid", "outline", "bar", "faceted"] as const,
			// description: "Visual style of the slider thumb.",
		},
		"thumb-shadow": {
			kind: "scalar",
			type: "shadow",
			cssVar: "--slider-thumb-shadow",
			default: "none",
			// description: "Elevation shadow of the slider thumb.",
		},
		"thumb-radius": {
			kind: "scalar",
			type: "radius",
			cssVar: "--slider-thumb-radius",
			default: "--radius-full",
			// description: "Radius of the slider thumb.",
		},
		"thumb-size": {
			kind: "scalar",
			type: "spacing",
			cssVar: "--slider-thumb-size",
			default: "calc(var(--spacing) * 3)",
			minValue: 3,
			maxValue: 8,
			step: 0.25,
			// description: "Size of the slider thumb.",
		},
		"track-size": {
			kind: "scalar",
			type: "spacing",
			cssVar: "--slider-size",
			default: "calc(var(--spacing) * 1)",
			minValue: 1,
			maxValue: 7,
			step: 0.25,
			// description: "Thickness of the slider track.",
		},
		"track-radius": {
			kind: "scalar",
			type: "radius",
			cssVar: "--slider-track-radius",
			default: "--radius-full",
			// description: "Radius of the slider track.",
		},
		"fill-color": {
			kind: "scalar",
			type: "color",
			cssVar: "--slider-fill-color",
			default: "--color-primary",
			// description: "Color of the slider fill.",
		},
		"default-cursor": {
			kind: "scalar",
			type: "cursor",
			cssVar: "--slider-cursor",
			default: "--cursor-interactive",
			// description: "Default cursor used by the slider.",
		},
		"cursor-while-dragging": {
			kind: "scalar",
			type: "cursor",
			cssVar: "--slider-dragging-cursor",
			default: "--cursor-interactive",
			// description: "Cursor used while dragging the slider thumb.",
		},
	},
} satisfies RegistryItem;

export default sliderMeta;
