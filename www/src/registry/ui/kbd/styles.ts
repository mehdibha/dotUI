import { createStyles } from "@/modules/core/styles";

import kbdMeta from "./meta";

const { useStyles, styles } = createStyles(kbdMeta, {
	base: {
		slots: {
			group: "inline-flex items-center gap-1",
			kbd: [
				"pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted px-1 font-medium font-sans text-fg-muted text-xs",
				"[&_svg:not([class*='size-'])]:size-3",
			],
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type KbdStyles = typeof styles;

export { useStyles };
