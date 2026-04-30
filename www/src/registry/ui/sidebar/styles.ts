import { createStyles } from "@/modules/core/styles";

import sidebarMeta from "./meta";

const { useStyles, styles } = createStyles(sidebarMeta, {
	base: {
		slots: {
			root: "group peer hidden md:block",
			gap: [
				"relative bg-transparent transition-[width] duration-250 ease-fluid-out",
				"w-(--sidebar-width-icon) group-data-expanded:w-(--sidebar-width)",
				"group-placement-right:rotate-180",
			],
			container: [
				"fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-250 ease-fluid-out md:flex",
				"w-(--sidebar-width-icon) group-data-expanded:w-(--sidebar-width)",
				"group-placement-left:left-0 group-placement-left:border-r",
				"group-placement-right:right-0 group-placement-right:border-l",
			],
			inner: "flex h-full w-full flex-col bg-sidebar transition-colors duration-250 ease-fluid-out",
			header: "flex flex-col gap-2 p-2",
			footer: "flex flex-col gap-2 p-2",
			separator: "mx-2 w-auto",
			content: "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
			section: "relative flex w-full min-w-0 flex-col p-2",
			heading: [
				"flex h-8 shrink-0 items-center whitespace-nowrap rounded-md px-2 font-medium text-fg-muted text-xs outline-hidden [&>svg]:size-4 [&>svg]:shrink-0",
			],
			list: "flex w-full min-w-0 flex-col gap-1",
			item: "whitespace-nowrap *:data-button:w-full *:data-button:justify-start *:data-button:overflow-hidden *:data-button:p-1.75 *:data-button:text-left *:data-button:[&>svg]:shrink-0",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type SidebarStyles = typeof styles;

export { useStyles };
