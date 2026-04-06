import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import separatorMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
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
});

export type SeparatorStyles = typeof defaultStyles;

export const { useStyles } = createStyles(separatorMeta, {
	default: defaultStyles,
});
