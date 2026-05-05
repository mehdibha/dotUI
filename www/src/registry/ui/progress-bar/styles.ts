import { createStyles } from "@/modules/core/styles";

import progressBarMeta from "./meta";

const { useStyles, styles } = createStyles(progressBarMeta, {
	base: {
		slots: {
			root: "",
			track: "",
			fill: "",
			output: "",
		},
		variants: {},
		defaultVariants: {},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type ProgressBarStyles = typeof styles;

export { useStyles };
