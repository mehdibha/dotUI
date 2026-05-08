import { createStyles } from "@/modules/core/styles";

import alertMeta from "./meta";

const { useStyles, styles } = createStyles(alertMeta, {
	base: {
		slots: {
			root: [
				"relative grid w-full items-start px-4 py-3",
				"rounded-(--alert-radius)",
				"has-[>svg]:has-data-alert-action:grid-cols-[--spacing(4)_1fr_auto] has-data-alert-title:has-data-alert-description:gap-y-0.5 has-[>svg]:grid-cols-[--spacing(4)_1fr] has-data-alert-action:grid-cols-[1fr_auto] has-[>svg]:gap-x-3 has-data-alert-action:pr-3",
				"*:[svg]:size-4 *:[svg]:translate-y-0.5 *:[svg]:text-current",
			],
			title: "[svg~&]:col-start-2",
			description: "[svg~&]:col-start-2",
			action:
				"flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:[[data-alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-alert-description]~&]:col-start-3 sm:[svg~[data-alert-title]~&]:col-start-3",
		},
		variants: {
			variant: {
				neutral: {},
				danger: {},
				warning: {},
				info: {},
				success: {},
			},
		},
		defaultVariants: {
			variant: "neutral",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
	params: {
		style: {
			default: {
				slots: {
					root: "border bg-card text-sm",
					title: "font-medium tracking-tight",
					description: "text-fg-muted **:[p]:leading-relaxed [svg~&]:col-start-2",
					action: "",
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
			},
			sousse: {
				slots: {
					root: "border bg-card text-sm",
					title: "font-medium tracking-tight",
					description: "text-fg-muted **:[p]:leading-relaxed [svg~&]:col-start-2",
					action: "",
				},
				variants: {
					variant: {
						neutral: {
							root: "text-fg",
						},
						danger: {
							root: "border-border-danger text-fg-danger",
						},
						warning: {
							root: "border-border-warning text-fg-warning",
						},
						info: {
							root: "border-border-info text-fg-info",
						},
						success: {
							root: "border-border-success text-fg-success",
						},
					},
				},
				defaultVariants: {
					variant: "neutral",
				},
			},
		},
	},
});

export type AlertStyles = typeof styles;

export { useStyles };
