import { createStyles } from "@/modules/core/styles";

import kbdMeta from "./meta";

const { useStyles, styles } = createStyles(kbdMeta, {
	base: {
		slots: {
			group: "inline-flex items-center gap-1",
			kbd: [
				"pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-fg-muted select-none",
				"**:[svg]:not-with-[size]:size-3",
			],
		},
	},
});

export type KbdStyles = typeof styles;

export { useStyles };
