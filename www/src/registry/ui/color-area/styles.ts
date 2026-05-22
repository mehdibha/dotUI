import { createStyles } from "@/modules/core/styles";

import colorAreaMeta from "./meta";

const { useStyles, styles } = createStyles(colorAreaMeta, {
	base: {
		base: "block aspect-square min-w-20 rounded-(--color-area-radius) disabled:[background:var(--color-disabled)]! in-data-dialog:w-full",
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
