import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import checkboxMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "flex items-center gap-2",
		control:
			"focus-reset focus-visible:focus-ring relative rounded-[--checkbox-radius] after:absolute after:-inset-x-3 after:-inset-y-2 read-only:cursor-default disabled:cursor-disabled",
		indicator: [
			"grid size-4 shrink-0 place-content-center rounded-sm border border-border-control bg-transparent text-transparent transition-[background-color,border-color,box-shadow,color] duration-200 *:[svg]:size-3",
			"selected:border-transparent selected:bg-primary selected:text-fg-on-primary",
			"disabled:border-border-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled disabled:indeterminate:bg-disabled",
			"invalid:border-border-danger invalid:selected:bg-danger-muted invalid:selected:text-fg-onMutedDanger",
			"indeterminate:border-transparent indeterminate:bg-primary indeterminate:text-fg-on-primary",
		],
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: "",
		control: "",
		indicator: "",
	},
});

export type CheckboxStyles = typeof defaultStyles;

export const { useStyles } = createStyles(checkboxMeta, {
	default: defaultStyles,
});
