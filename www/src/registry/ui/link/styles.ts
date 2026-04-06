import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import linkMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: [
		"focus-reset focus-visible:focus-ring",
		"inline-flex items-center gap-1 transition-colors disabled:text-fg-disabled",
	],
	variants: {
		variant: {
			accent: "text-fg-accent",
			quiet: "font-medium text-fg underline underline-offset-2",
			unstyled: "",
		},
	},
	defaultVariants: {
		variant: "accent",
	},
});

export type LinkStyles = typeof defaultStyles;

export const { useStyles } = createStyles(linkMeta, {
	default: defaultStyles,
});
