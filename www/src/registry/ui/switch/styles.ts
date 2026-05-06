import { createStyles } from "@/modules/core/styles";

import switchMeta from "./meta";

const { useStyles, styles } = createStyles(switchMeta, {
	base: {
		slots: {
			root: "flex items-center has-data-description:items-start",
			control: [
				"focus-reset focus-visible:focus-ring relative flex items-center gap-2 rounded-(--switch-radius) not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-(--switch-card-radius)",
				"transition-colors duration-75 has-data-label:w-full has-data-label:justify-between has-data-label:border has-data-label:selected:border-[color-mix(in_srgb,var(--color-accent)_25%,var(--color-bg))] has-data-label:selected:bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-bg))] has-data-label:p-2.5",
			],
			indicator: [
				"inline-flex shrink-0 cursor-pointer items-center rounded-(--switch-radius) border border-transparent bg-neutral p-0.5 transition-[background-color,border-color,box-shadow] duration-200",
				"selected:bg-accent",
				"read-only:cursor-default disabled:cursor-disabled disabled:border-border-disabled disabled:selected:border-transparent disabled:bg-transparent disabled:selected:bg-disabled",
			],
			thumb: [
				"pointer-events-none block rounded-(--switch-radius) bg-white shadow-sm transition-[background-color,margin,width] duration-200",
				"disabled:bg-fg-disabled",
			],
		},
		variants: {
			size: {
				sm: {
					indicator: "h-5 w-9",
					thumb: "selected:ml-4 selected:pressed:ml-3 size-4 pressed:w-5",
				},
				md: {
					indicator: "h-6 w-11",
					thumb: "selected:ml-5 selected:pressed:ml-4 size-5 pressed:w-6",
				},
				lg: {
					indicator: "h-7 w-13",
					thumb: "selected:ml-6 selected:pressed:ml-5 size-6 pressed:w-7",
				},
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
	density: {
		compact: {
			slots: {
				root: "gap-2",
			},
		},
		default: {
			slots: {
				root: "gap-2",
			},
		},
		comfortable: {
			slots: {
				root: "gap-3",
			},
		},
	},
});

export type SwitchStyles = typeof styles;

export { useStyles };
