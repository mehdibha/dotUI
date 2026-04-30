import { createStyles } from "@/modules/core/styles";

import groupMeta from "./meta";

const { useStyles, styles } = createStyles(groupMeta, {
	base: {
		slots: {
			root: [
				"flex w-fit items-stretch",
				"has-data-[slot=group]:gap-2",
				"*:hover:z-1 *:focus-visible:z-10 *:has-[input]:z-2 *:[input]:z-2",
				"*:data-[slot=label]:rounded-md *:data-[slot=label]:border *:data-[slot=label]:bg-card *:data-[slot=label]:px-4",
			],
			separator: "",
			text: "flex items-center gap-2 rounded-md border bg-card px-4 font-medium text-sm shadow-xs [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
		},
		variants: {
			orientation: {
				horizontal: {
					root: [
						"-space-x-px not-has-[>[data-slot=group]]:*:not-last:rounded-r-none not-has-[>[data-slot=group]]:*:not-first:rounded-l-none",
						"not-has-[>[data-slot=group]]:*:not-last:data-[slot=select]:*:data-[slot=button]:rounded-r-none not-has-[>[data-slot=group]]:*:not-[:nth-child(2)]:data-[slot=select]:*:data-[slot=button]:rounded-l-none",
					],
					separator: "",
				},
				vertical: {
					root: "flex-col not-has-[>[data-slot=group]]:*:not-first:rounded-t-none not-has-[>[data-slot=group]]:*:not-last:rounded-b-none",
					separator: "",
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
