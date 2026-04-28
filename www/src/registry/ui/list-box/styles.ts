import { createStyles } from "@/modules/core/styles";

import listBoxMeta from "./meta";

const { useStyles, styles } = createStyles(listBoxMeta, {
	base: {
		slots: {
			root: ["not-has-data-listbox-section:scroll-my-1 not-has-data-listbox-section:p-1 outline-hidden"],
			item: [
				"relative flex w-full cursor-interactive select-none items-center outline-hidden disabled:pointer-events-none disabled:text-fg-disabled **:[svg]:pointer-events-none **:[svg]:shrink-0",
				"focus:bg-highlight focus:text-fg-on-highlight",
				"*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
				"rounded-(--list-box-item-radius)",
				"*:[kbd]:ml-auto *:[kbd]:bg-transparent *:[kbd]:text-fg-muted",
			],
			indicator: ["pointer-events-none absolute right-2 flex items-center justify-center"],
			itemLabel: [],
			itemDescription: [],
			loadMore: ["flex w-full items-center justify-center py-1 text-fg-muted"],
			section: ["scroll-my-1 p-1"],
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
});

export type ListBoxStyles = typeof styles;

export { useStyles };
