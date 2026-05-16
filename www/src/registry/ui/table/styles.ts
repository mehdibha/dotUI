import { createStyles } from "@/modules/core/styles";

import tableMeta from "./meta";

const { useStyles, styles } = createStyles(tableMeta, {
	base: {
		slots: {
			container: "relative scroll-pt-[2.321rem] overflow-auto rounded-lg border",
			table: "w-full text-sm",
			header: "sticky top-0 z-10 bg-bg",
			column: "h-10 px-2 text-left align-middle font-medium whitespace-nowrap",
			resizer: "",
			body: "",
			row: "",
			cell: "p-2 align-middle whitespace-nowrap",
			loadMore: [
				"relative h-7 **:data-[slot=loader]:absolute **:data-[slot=loader]:top-0 **:data-[slot=loader]:left-1/2 **:data-[slot=loader]:-translate-x-1/2",
				"[&_[data-slot=loader]_svg]:size-4",
			],
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type TableStyles = typeof styles;

export { useStyles };
