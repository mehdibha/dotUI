import { createStyles } from "@/modules/core/styles";

import radioGroupMeta from "./meta";

const { useStyles, styles } = createStyles(radioGroupMeta, {
	base: {
		slots: {
			root: "",
			indicator: "",
		},
	},
	density: { compact: {}, default: {}, comfortable: {} },
	styles: {
		default: {
			slots: {
				root: ["flex items-center gap-2 has-data-[slot=description]:items-start"],
				indicator: [
					"flex size-4 shrink-0 items-center justify-center rounded-full border border-border-control bg-transparent text-transparent",
					"transition-[background-color,border-color,box-shadow,color] duration-75",
					// selected state
					"selected:border-transparent selected:bg-primary selected:text-fg-on-primary",
					// read-only state
					"read-only:cursor-default",
					// disabled state
					"disabled:cursor-default disabled:border-border-disabled selected:disabled:bg-disabled selected:disabled:text-fg-disabled indeterminate:disabled:bg-disabled",
					// invalid state
					"invalid:border-border-danger invalid:selected:bg-danger-muted invalid:selected:text-fg-onMutedDanger",
					// indeterminate state
					"indeterminate:border-transparent indeterminate:bg-primary indeterminate:text-fg-on-primary",
				],
			},
		},
	},
});

export type RadioGroupStyles = typeof styles;

export { useStyles };
