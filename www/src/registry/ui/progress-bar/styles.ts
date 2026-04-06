import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import progressBarMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		indicator: "",
		filler: "",
		valueLabel: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: "flex w-60 flex-col gap-2",
		indicator: "relative h-2.5 w-full overflow-hidden rounded-full",
		filler: [
			"h-full w-full min-w-14 flex-1 origin-left bg-fg transition-transform",
			"indeterminate:mask-[linear-gradient(75deg,rgb(0,0,0)_30%,rgba(0,0,0,0.65)_80%)] indeterminate:mask-size-[200%] indeterminate:animate-progress-indeterminate indeterminate:[-webkit-mask-image:linear-gradient(75deg,rgb(0,0,0)_30%,rgba(0,0,0,0.65)_80%)] indeterminate:[-webkit-mask-size:200%]",
		],
		valueLabel: "text-sm",
	},
	variants: {
		variant: {
			primary: {
				indicator: "bg-muted",
				filler: "bg-primary",
			},
			accent: {
				indicator: "bg-accent-muted",
				filler: "bg-accent",
			},
			warning: {
				indicator: "bg-warning-muted",
				filler: "bg-warning",
			},
			danger: {
				indicator: "bg-danger-muted",
				filler: "bg-danger",
			},
			success: {
				indicator: "bg-success-muted",
				filler: "bg-success",
			},
		},
		size: {
			sm: {
				indicator: "h-1",
			},
			md: {
				indicator: "h-2.5",
			},
			lg: {
				indicator: "h-4",
			},
		},
	},
	defaultVariants: {
		variant: "accent",
		size: "md",
	},
});

export type ProgressBarStyles = typeof defaultStyles;

export const { useStyles } = createStyles(progressBarMeta, {
	default: defaultStyles,
});
