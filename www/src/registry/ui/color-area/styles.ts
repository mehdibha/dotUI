import { createStyles } from "@/modules/core/styles";

import colorAreaMeta from "./meta";

const { useStyles, styles } = createStyles(colorAreaMeta, {
	base: {
		base: "cn-color-area block min-w-20 rounded-(--color-area-radius) disabled:[background:var(--color-disabled)]!",
	},
	density: {
		compact: { base: "size-40" },
		default: { base: "size-48" },
		comfortable: { base: "size-56" },
	},
	styles: {
		default: {
			base: "",
		},
	},
});

export type ColorAreaStyles = typeof styles;

export { useStyles };
