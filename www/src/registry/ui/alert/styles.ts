import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import alertMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		title: "",
		description: "",
		action: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: "relative grid w-full items-start gap-y-0.5 rounded-lg border bg-card px-4 py-3 text-sm has-[>svg]:has-data-alert-action:grid-cols-[calc(var(--spacing)*4)_1fr_auto] has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-data-alert-action:grid-cols-[1fr_auto] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
		title: "line-clamp-1 min-h-4 font-medium tracking-tight [svg~&]:col-start-2",
		description: "text-fg-muted [&_p]:leading-relaxed [svg~&]:col-start-2",
		action:
			"flex gap-1 sm:row-start-1 sm:row-end-3 sm:self-center sm:[[data-alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-alert-description]~&]:col-start-3 sm:[svg~[data-alert-title]~&]:col-start-3",
	},
	variants: {
		variant: {
			neutral: {
				root: "text-fg",
			},
			danger: {
				root: "text-fg-danger *:data-alert-description:text-fg-danger/90",
			},
			warning: {
				root: "text-fg-warning *:data-alert-description:text-fg-warning/90",
			},
			info: {
				root: "text-fg-info *:data-alert-description:text-fg-info/90",
			},
			success: {
				root: "text-fg-success *:data-alert-description:text-fg-success/90",
			},
		},
	},
	defaultVariants: {
		variant: "neutral",
	},
});

export type AlertStyles = typeof defaultStyles;

export const { useStyles } = createStyles(alertMeta, {
	default: defaultStyles,
});
