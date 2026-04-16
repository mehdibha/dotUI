import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import checkboxMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		label: "",
		indicator: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: [
			"focus-reset focus-visible:focus-ring",
			"flex items-center gap-2 text-sm leading-none has-data-[slot=description]:items-start",
			"disabled:cursor-not-allowed disabled:text-fg-disabled",
		],
		indicator: [
			"flex size-4 shrink-0 items-center justify-center rounded-sm border border-border-control bg-transparent text-transparent",
			"transition-[background-color,border-color,box-shadow,color] duration-75",
			// selected state
			"selected:border-transparent selected:bg-primary selected:text-fg-on-primary",
			// read-only state
			"read-only:cursor-default",
			// disabled state
			"disabled:cursor-not-allowed disabled:border-border-disabled selected:disabled:bg-disabled selected:disabled:text-fg-disabled indeterminate:disabled:bg-disabled",
			// invalid state
			"invalid:border-border-danger invalid:selected:bg-danger-muted invalid:selected:text-fg-onMutedDanger",
			// indeterminate state
			"indeterminate:border-transparent indeterminate:bg-primary indeterminate:text-fg-on-primary",
		],
	},
});

export type CheckboxStyles = typeof defaultStyles;

export const { useStyles } = createStyles(checkboxMeta, {
	default: defaultStyles,
});
