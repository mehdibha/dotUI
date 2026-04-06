import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import listBoxMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		item: "",
		section: "",
		sectionTitle: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: [
			"focus-reset focus-visible:focus-ring",
			"data-standalone:max-h-68 data-standalone:w-48 data-standalone:overflow-y-auto data-standalone:rounded-md data-standalone:border data-standalone:bg-card data-standalone:p-1 data-standalone:shadow-sm",
			"w-full p-1",
			"h-full overflow-y-auto",
		],
		item: [
			"relative flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-hidden transition-colors focus:bg-inverse/10 disabled:pointer-events-none disabled:**:text-fg-disabled",
			"selection-multiple:pr-4 selection-single:pr-4",
		],
		section: "",
		sectionTitle: "",
	},
	variants: {
		variant: {
			default: { item: "" },
			success: {
				item: "",
			},
			warning: {
				item: "",
			},
			danger: {
				item: "",
			},
		},
	},
});

export type ListBoxStyles = typeof defaultStyles;

export const { useStyles } = createStyles(listBoxMeta, {
	default: defaultStyles,
});
