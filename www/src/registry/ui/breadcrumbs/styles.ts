import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import breadcrumbsMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		item: "",
		link: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: "wrap-break-word flex flex-wrap items-center gap-1.5 text-fg-muted text-sm [&_svg]:size-4",
		item: "inline-flex items-center gap-1",
		link: [
			"focus-reset focus-visible:focus-ring",
			"inline-flex items-center gap-1 rounded px-0.5 current:text-fg leading-none transition-colors disabled:cursor-default disabled:not-current:text-fg-disabled hover:[a]:text-fg",
		],
	},
});

export type BreadcrumbsStyles = typeof defaultStyles;

export const { useStyles } = createStyles(breadcrumbsMeta, {
	default: defaultStyles,
});
