import { createStyles } from "@/modules/core/styles";

import listBoxMeta from "./meta";

const { useStyles, styles } = createStyles(listBoxMeta, {
	base: {
		slots: {
			root: [
				"scroll-my-1 p-1 outline-hidden",
				// stack + horizontal
				"layout-stack:orientation-horizontal:flex layout-stack:orientation-horizontal:flex-row",
				// grid
				"layout-grid:grid layout-grid:gap-1",
				"layout-grid:orientation-vertical:grid-cols-2",
				"layout-grid:orientation-horizontal:grid-flow-col layout-grid:orientation-horizontal:grid-rows-2",
				"**:data-separator:-mx-1 **:data-separator:my-1 **:data-separator:w-auto",
			],
			item: [
				"relative flex w-full cursor-interactive select-none items-center gap-2 rounded-(--list-box-item-radius) outline-hidden disabled:pointer-events-none **:[svg]:pointer-events-none **:[svg]:shrink-0",
				// hover
				"hover:not-in-data-[trigger=ComboBox]:not-in-data-[trigger=Select]:bg-highlight hover:not-in-data-[trigger=ComboBox]:not-in-data-[trigger=Select]:text-fg-on-highlight",
				// focus
				"focus:in-[:is([data-trigger=ComboBox],[data-trigger=Select])]:bg-highlight focus:in-[:is([data-trigger=ComboBox],[data-trigger=Select])]:text-fg-on-highlight",
				// focus-visible bg (highlight color provided by the `highlight` param)
				"focus-visible:bg-highlight",
				// disabled
				"disabled:text-fg-disabled",
				// with description
				"has-data-listbox-item-description:has-[>svg]:pl-8 has-data-listbox-item-description:flex-col has-data-listbox-item-description:items-start has-data-listbox-item-description:gap-0 has-data-listbox-item-description:**:data-listbox-item-indicator:top-2 has-data-listbox-item-description:*:[svg]:absolute has-data-listbox-item-description:*:[svg]:top-2 has-data-listbox-item-description:*:[svg]:left-2",
				// kbd
				"*:[kbd]:ml-auto *:[kbd]:bg-transparent *:[kbd]:text-fg-muted",
			],
			indicator: ["pointer-events-none absolute right-2 flex items-center justify-center"],
			itemLabel: ["in-[[data-listbox-item][data-disabled]]:text-fg-disabled"],
			itemDescription: ["in-[[data-listbox-item][data-disabled]]:text-fg-disabled text-fg-muted"],
			loadMore: ["flex w-full items-center justify-center py-1 text-fg-muted"],
			section: ["scroll-my-1"],
			sectionTitle: ["px-2 py-1.5 text-fg-muted text-xs"],
		},
		variants: {
			variant: {
				default: {},
				danger: {},
			},
		},
		defaultVariants: { variant: "default" },
	},

	density: {
		compact: {
			slots: {
				root: "text-xs/relaxed",
				item: "min-h-7 gap-2 px-2 py-1 text-xs/relaxed data-selection-mode:pr-8 **:[svg]:not-with-[size]:size-3.5",
			},
		},
		default: {
			slots: {},
		},
		comfortable: {
			slots: {},
		},
	},

	params: {
		highlight: {
			subtle: {
				vars: {
					"--color-highlight": "var(--neutral-300)",
					"--color-fg-on-highlight": "var(--on-neutral-300)",
				},
				tv: {
					slots: {
						item: "overflow-hidden focus-visible:before:absolute focus-visible:before:inset-y-0 focus-visible:before:left-0 focus-visible:before:w-0.5 focus-visible:before:rounded-[inherit] focus-visible:before:bg-accent",
					},
				},
			},
			accent: {
				vars: {
					"--color-highlight": "var(--accent-500)",
					"--color-fg-on-highlight": "var(--on-accent-500)",
				},
			},
		},
	},
});

export type ListBoxStyles = typeof styles;

export { useStyles };
