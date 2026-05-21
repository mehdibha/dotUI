import { createStyles } from "@/modules/core/styles";

import groupMeta from "./meta";

const { useStyles, styles } = createStyles(groupMeta, {
	base: {
		slots: {
			root: [
				"flex w-fit items-stretch",
				"has-data-[slot=group]:gap-2",
				"*:hover:z-1 *:focus:z-3 *:focus-visible:z-3 *:has-[input]:z-2 *:[input]:z-2",
				"*:data-label:shrink-0 *:data-label:rounded-md *:data-label:border *:data-label:bg-card *:data-label:px-4",
			],
			text: "flex items-center gap-2 rounded-md border bg-card px-4 text-sm font-medium shadow-xs **:[svg]:pointer-events-none **:[svg]:not-with-[size]:size-4",
		},
		variants: {
			orientation: {
				horizontal: {
					root: [
						"-space-x-px not-has-data-group:*:not-first:rounded-l-none not-has-data-group:*:not-last:rounded-r-none",
						"not-has-data-group:*:not-last:data-select:*:data-button:rounded-r-none not-has-data-group:*:not-[:nth-child(2)]:data-select:*:data-button:rounded-l-none",
					],
				},
				vertical: {
					root: "flex-col not-has-data-group:*:not-first:rounded-t-none not-has-data-group:*:not-last:rounded-b-none",
				},
			},
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type GroupStyles = typeof styles;

export { useStyles };
