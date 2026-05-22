import { createStyles } from "@/modules/core/styles";

import tabsMeta from "./meta";

const { useStyles, styles } = createStyles(tabsMeta, {
	base: {
		slots: {
			root: "flex gap-2",
			list: "inline-flex w-fit items-center justify-center text-fg-muted",
			tab: [
				"relative isolate inline-flex flex-1 cursor-default items-center justify-center border border-transparent font-medium whitespace-nowrap focus-reset transition-[background-color,border-color,color,box-shadow] select-none focus-visible:focus-ring",
				"text-fg-muted hover:text-fg disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
				"**:[svg]:pointer-events-none **:[svg]:shrink-0",
				"[&:has([data-tab-indicator])_>_[data-tab-default-indicator]]:hidden",
			],
			selectionIndicator: [
				"pointer-events-none absolute rounded-md duration-150 ease-out motion-safe:transition-[translate,width,height]",
			],
			panel: "flex-1 outline-none data-[inert=true]:hidden",
		},
		variants: {
			orientation: {
				horizontal: {
					root: "flex-col",
					list: "h-(--tabs-list-height) flex-row",
					tab: "h-[calc(100%-1px)]",
				},
				vertical: {
					root: "flex-row",
					list: "h-fit flex-col",
					tab: "w-full justify-start",
				},
			},
			variant: {
				default: {
					list: "rounded-lg bg-muted p-[3px]",
					tab: "rounded-md selected:text-fg-on-selected",
					selectionIndicator: "inset-0 bg-selected shadow-sm",
				},
				line: {
					list: "gap-1 rounded-none bg-transparent p-[3px]",
					tab: "rounded-md selected:text-fg",
					selectionIndicator:
						"rounded-full bg-fg orientation-horizontal:bottom-[-5px] orientation-horizontal:left-0 orientation-horizontal:h-0.5 orientation-horizontal:w-full orientation-vertical:top-0 orientation-vertical:-right-1 orientation-vertical:h-full orientation-vertical:w-0.5",
				},
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
	density: {
		compact: {
			slots: {
				root: "[--tabs-list-height:2rem]",
				tab: "gap-1.5 px-1.5 py-0.5 text-xs has-data-icon-end:pr-1 has-data-icon-start:pl-1 **:[svg]:not-with-[size]:size-3.5",
				panel: "text-xs/relaxed",
			},
		},
		default: {
			slots: {
				root: "[--tabs-list-height:2rem]",
				tab: "gap-1.5 px-1.5 py-0.5 text-sm has-data-icon-end:pr-1 has-data-icon-start:pl-1 **:[svg]:not-with-[size]:size-4",
				panel: "text-sm",
			},
		},
		comfortable: {
			slots: {
				root: "[--tabs-list-height:2.25rem]",
				tab: "gap-1.5 px-2 py-1 text-sm has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 **:[svg]:not-with-[size]:size-4",
				panel: "text-sm",
			},
		},
	},
});

export type TabsStyles = typeof styles;

export { useStyles };
