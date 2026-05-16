import { createStyles } from "@/modules/core/styles";

import checkboxMeta from "./meta";

const { useStyles, styles } = createStyles(checkboxMeta, {
	base: {
		slots: {
			root: "flex items-center has-data-description:items-start",
			control: [
				"relative flex items-center gap-2 rounded-(--checkbox-radius) focus-reset not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default focus-visible:focus-ring disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-(--checkbox-card-radius)",
				"transition-colors duration-75 has-data-label:w-full has-data-label:border has-data-label:p-2.5 has-data-label:selected:border-[color-mix(in_srgb,var(--color-primary)_25%,var(--color-bg))] has-data-label:selected:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-bg))]",
			],
			indicator: [
				"grid size-4 shrink-0 place-content-center rounded-(--checkbox-radius) border border-border-control bg-transparent text-transparent transition-[background-color,border-color,box-shadow,color] duration-75 *:[svg]:size-3",
				"selected:border-transparent selected:bg-primary selected:text-fg-on-primary",
				"disabled:border-border-disabled disabled:indeterminate:bg-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled",
				"invalid:selected:text-fg-onMutedDanger invalid:border-border-danger invalid:selected:bg-danger-muted",
				"indeterminate:border-transparent indeterminate:bg-primary indeterminate:text-fg-on-primary",
			],
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

export type CheckboxStyles = typeof styles;

export { useStyles };
