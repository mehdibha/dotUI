import { createStyles } from "@/modules/core/styles";

import menuMeta from "./meta";

const { useStyles, styles } = createStyles(menuMeta, {
	base: {
		slots: {
			root: [
				"max-h-[inherit] scroll-my-1 overflow-y-auto rounded-[inherit] p-1 outline-hidden",
				"**:data-separator:-mx-1 **:data-separator:my-1 **:data-separator:w-auto",
			],
			item: [
				"relative flex w-full cursor-interactive select-none items-center gap-2 rounded-sm outline-hidden disabled:pointer-events-none **:[svg]:pointer-events-none **:[svg]:shrink-0",
				"focus:bg-highlight focus:text-fg-on-highlight",
				"disabled:text-fg-disabled disabled:**:text-current",
				"has-data-menu-item-description:has-[>svg]:pl-8 has-data-menu-item-description:flex-col has-data-menu-item-description:items-start has-data-menu-item-description:gap-0 has-data-menu-item-description:*:[svg]:absolute has-data-menu-item-description:*:[svg]:top-2 has-data-menu-item-description:*:[svg]:left-2",
				"data-selection-mode:pr-8",
				"*:[kbd]:ml-auto *:[kbd]:bg-transparent *:[kbd]:text-fg-muted",
				// danger
				"data-[variant=danger]:text-fg-danger data-[variant=danger]:focus:bg-danger-muted",
			],
			indicator: ["pointer-events-none absolute right-2 flex items-center justify-center"],
			itemLabel: [""],
			itemDescription: ["text-fg-muted"],
			section: ["scroll-my-1"],
			sectionTitle: ["px-2 py-1.5 text-fg-muted text-xs"],
		},
	},
	density: {
		compact: {
			slots: {
				root: "text-xs/relaxed",
				item: "min-h-7 gap-2 px-1.5 py-1 text-xs/relaxed **:[svg]:not-with-[size]:size-3.5",
				sectionTitle: "px-1.5 py-1",
			},
		},
		default: {
			slots: {
				root: "text-sm",
				item: "gap-2 px-2 py-1 text-sm **:[svg]:not-with-[size]:size-4",
				sectionTitle: "px-2 py-1",
			},
		},
		comfortable: {
			slots: {
				root: "text-sm",
				item: "gap-2 px-2 py-1.5 text-sm **:[svg]:not-with-[size]:size-4",
			},
		},
	},
	params: {
		highlight: {
			subtle: {
				slots: {
					item: "overflow-hidden focus-visible:before:absolute focus-visible:before:inset-y-0 focus-visible:before:left-0 focus-visible:before:w-0.5 focus-visible:before:rounded-[inherit] focus-visible:before:bg-accent",
				},
				vars: {
					"--color-highlight": "var(--neutral-300)",
					"--color-fg-on-highlight": "var(--on-neutral-300)",
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

export type MenuStyles = typeof styles;

export { useStyles };
