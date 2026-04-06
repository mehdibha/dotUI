import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import cardMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		header: "",
		title: "",
		description: "",
		action: "",
		content: "",
		footer: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: "flex flex-col gap-6 rounded-xl border bg-card py-6 text-fg shadow-sm",
		header:
			"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
		title: "font-semibold leading-none",
		description: "text-fg-muted text-sm",
		action: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
		content: "flex-1 px-6",
		footer: "flex items-center px-6 [.border-t]:pt-6",
	},
});

export type CardStyles = typeof defaultStyles;

export const { useStyles } = createStyles(cardMeta, {
	default: defaultStyles,
});
