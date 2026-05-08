import { createStyles } from "@/modules/core/styles";

import badgeMeta from "./meta";

const { useStyles, styles } = createStyles(badgeMeta, {
	base: {
		base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-(--badge-radius) font-medium text-xs [&>svg]:pointer-events-none",
		variants: {
			appearance: {
				solid: "bg-(--color) text-(--fg)",
				subtle:
					"bg-[color-mix(in_srgb,var(--color)_30%,var(--color-bg))] text-[color-mix(in_srgb,var(--color)_60%,var(--color-fg))]",
			},
			variant: {
				neutral: "bg-neutral text-fg-on-neutral",
				accent: "[--color:var(--color-accent)] [--fg:var(--color-fg-on-accent)]",
				danger: "[--color:var(--color-danger)] [--fg:var(--color-fg-on-danger)]",
				success: "[--color:var(--color-success)] [--fg:var(--color-fg-on-success)]",
				warning: "[--color:var(--color-warning)] [--fg:var(--color-fg-on-warning)]",
				info: "[--color:var(--color-info)] [--fg:var(--color-fg-on-info)]",
			},
			size: {
				sm: "h-4.5 min-w-4.5 px-1.5 [&>svg]:size-2.5 **:data-loader:*:[svg]:size-2.5",
				md: "h-5 min-w-5 px-1.75 [&>svg]:size-3 **:data-loader:*:[svg]:size-3",
				lg: "h-5.5 min-w-5.5 px-2.25 [&>svg]:size-3.5 **:data-loader:*:[svg]:size-3.5",
			},
		},
		defaultVariants: {
			appearance: "solid",
			variant: "neutral",
			size: "md",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type BadgeStyles = typeof styles;

export { useStyles };
