import { createStyles } from "@/modules/core/styles";

import breadcrumbsMeta from "./meta";

const { useStyles, styles } = createStyles(breadcrumbsMeta, {
	base: {
		slots: {
			root: "wrap-break-word flex flex-wrap items-center gap-1.5 text-fg-muted text-sm",
			item: "inline-flex items-center gap-1",
			link: [
				"focus-reset focus-visible:focus-ring",
				"inline-flex items-center gap-1 rounded px-0.5 current:text-fg leading-none transition-colors disabled:cursor-default disabled:not-current:text-fg-disabled hover:[a]:text-fg",
			],
			separator: "[&_svg]:size-4",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type BreadcrumbsStyles = typeof styles;

export { useStyles };
