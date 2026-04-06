import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import tableMeta from "./meta";

const baseStyles = tv({
	slots: {
		container: "",
		table: "",
		header: "",
		column: "",
		resizer: "",
		body: "",
		row: "",
		cell: "",
		loadMore: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		container: "relative scroll-pt-[2.321rem] overflow-auto rounded-lg border",
		table: "w-full text-sm",
		header: "sticky top-0 z-10 bg-bg",
		column: "h-10 whitespace-nowrap px-2 text-left align-middle font-medium",
		resizer: "",
		body: "",
		row: "",
		cell: "whitespace-nowrap p-2 align-middle",
		loadMore: [
			"relative h-7 **:data-[slot=loader]:absolute **:data-[slot=loader]:top-0 **:data-[slot=loader]:left-1/2 **:data-[slot=loader]:-translate-x-1/2",
			"[&_[data-slot=loader]_svg]:size-4",
		],
	},
});

export type TableStyles = typeof defaultStyles;

export const { useStyles } = createStyles(tableMeta, {
	default: defaultStyles,
});
