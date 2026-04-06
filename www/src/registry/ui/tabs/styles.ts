import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import tabsMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		list: "",
		tab: "",
		selectionIndicator: "",
		panel: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: "flex flex-col gap-2",
		list: "flex",
		tab: "relative cursor-default p-2 selected:text-fg text-fg-muted text-sm transition-colors hover:text-fg [&:has([data-tab-indicator])_>_[data-tab-default-indicator]]:hidden",
		selectionIndicator: [
			"absolute rounded-full bg-accent duration-150 ease-out motion-safe:transition-[translate,width,height]",
		],
		panel: "",
	},
	variants: {
		orientation: {
			horizontal: {
				root: "flex-col",
				list: "flex-row border-b",
				selectionIndicator: "bottom-0 left-0 h-0.5 w-full translate-y-px",
			},
			vertical: {
				root: "flex-row",
				list: "flex-col border-r",
				selectionIndicator: "right-0 bottom-0 h-full w-0.5",
			},
		},
	},
});

export type TabsStyles = typeof defaultStyles;

export const { useStyles } = createStyles(tabsMeta, {
	default: defaultStyles,
});
