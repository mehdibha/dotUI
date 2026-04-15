import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import cardMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "cn-card group/card flex flex-col rounded-(--card-radius) border bg-card has-[>img:first-child]:pt-0 *:[img]:first:rounded-t-(--card-radius) *:[img]:last:rounded-b-(--card-radius)",
		header:
			"cn-card-header group/card-header @container/card-header grid auto-rows-min items-start rounded-t-(--card-radius) has-data-card-action:grid-cols-[1fr_auto] has-data-card-description:grid-rows-[auto_auto]",
		title: "cn-card-title font-heading",
		description: "cn-card-description text-fg-muted",
		action: "cn-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end",
		content: "cn-card-content",
		footer: "cn-card-footer flex items-center rounded-b-(--card-radius)",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
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

const tasnimStyles = tv({
	extend: baseStyles,
	slots: {
		root: "",
		header: "",
		title: "",
		description: "",
		action: "",
		content: "",
		footer: "border-t bg-neutral-900/50",
	},
});

export type CardStyles = typeof defaultStyles;

export const { useStyles } = createStyles(cardMeta, {
	default: defaultStyles,
	tasnim: tasnimStyles,
});
