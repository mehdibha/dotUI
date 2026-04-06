import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import kbdMeta from "./meta";

const baseStyles = tv({
	slots: {
		group: "",
		kbd: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		group: "inline-flex items-center gap-1",
		kbd: [
			"pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted px-1 font-medium font-sans text-fg-muted text-xs",
			"[&_svg:not([class*='size-'])]:size-3",
		],
	},
});

export type KbdStyles = typeof defaultStyles;

export const { useStyles } = createStyles(kbdMeta, {
	default: defaultStyles,
});
