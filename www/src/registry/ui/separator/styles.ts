import { createStyles } from "@/modules/core/styles";

import separatorMeta from "./meta";

const { useStyles, styles } = createStyles(separatorMeta, {
	base: {
		base: "",
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
	styles: {
		default: {
			base: "separator shrink-0 border-0 bg-border",
			variants: {
				orientation: {
					horizontal: "h-px w-full",
					vertical: "h-full w-px",
				},
			},
			defaultVariants: {
				orientation: "horizontal",
			},
		},
	},
});

export type SeparatorStyles = typeof styles;

export { useStyles };
