import { createStyles } from "@/modules/core/styles";

import colorAreaMeta from "./meta";

const { useStyles, styles } = createStyles(colorAreaMeta, {
	base: {
		base: "block aspect-square in-data-dialog:w-full min-w-20 rounded-(--color-area-radius) disabled:[background:var(--color-disabled)]!",
	},
	density: {
		compact: {
			base: "w-40",
		},
		default: {
			base: "w-48",
		},
		comfortable: {
			base: "w-56",
		},
	},
});

export type ColorAreaStyles = typeof styles;

export { useStyles };
