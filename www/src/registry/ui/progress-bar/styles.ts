import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import progressBarMeta from "./meta";

const { useStyles, styles } = createStyles(progressBarMeta, {
	base: {
		slots: {
			root: fieldStyles().field(),
			track:
				"relative flex h-(--progress-track-size) w-full items-center overflow-x-hidden rounded-(--progress-track-radius) bg-muted",
			fill: "data-indeterminate:animate-progress-indeterminate h-full w-full origin-left bg-(--progress-fill-color) transition-all",
			output: "ml-auto text-fg-muted tabular-nums",
		},
		variants: {},
		defaultVariants: {},
	},
	density: {
		compact: {
			slots: {
				output: "text-xs",
			},
		},
		default: {
			slots: {
				output: "text-sm",
			},
		},
		comfortable: {
			slots: {
				output: "text-sm",
			},
		},
	},
});

export type ProgressBarStyles = typeof styles;

export { useStyles };
