import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import checkboxMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "cn-checkbox flex items-center has-data-description:items-start",
		control: [
			"cn-checkbox-control focus-reset focus-visible:focus-ring relative flex items-center gap-2 rounded-(--checkbox-radius) not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-(--checkbox-card-radius)",
			"transition-colors duration-75 has-data-label:w-full has-data-label:border has-data-label:selected:border-[color-mix(in_srgb,var(--color-primary)_25%,var(--color-bg))] has-data-label:selected:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-bg))] has-data-label:p-2.5",
		],
		indicator: [
			"cn-checkbox-indicator grid size-4 shrink-0 place-content-center rounded-(--checkbox-radius) border border-border-control bg-transparent text-transparent transition-[background-color,border-color,box-shadow,color] duration-75 *:[svg]:size-3",
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
