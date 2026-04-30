import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import sliderMeta from "./meta";

const { useStyles, styles } = createStyles(sliderMeta, {
	base: {
		slots: {
			root: fieldStyles().field(),
			track: "relative my-1 grow cursor-pointer rounded-full bg-neutral disabled:cursor-not-allowed disabled:bg-disabled",
			filler: "pointer-events-none absolute rounded-full bg-accent disabled:bg-disabled",
			thumb: [
				"size-4 rounded-full bg-white shadow-md ring-primary/30 transition-[width,height,box-shadow]",
				"dragging:size-5 dragging:ring-0 ring-accent/30 hover:ring-4",
				"top-[50%] left-[50%]",
				"focus-visible:focus-ring",
				"disabled:border disabled:border-bg disabled:bg-disabled",
			],
			output: "text-fg-muted text-sm disabled:text-fg-disabled",
		},
		variants: {
			orientation: {
				horizontal: {
					track: "h-1.5 w-48",
					filler: "top-0 h-full",
				},
				vertical: {
					root: "items-center",
					track: "h-48 w-2",
					filler: "bottom-0 w-full",
				},
			},
		},
		defaultVariants: {
			orientation: "horizontal",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type SliderStyles = typeof styles;

export { useStyles };
