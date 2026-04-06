import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import calendarMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		header: "",
		grid: "",
		gridHeader: "",
		gridHeaderCell: "",
		gridBody: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: "flex flex-col gap-4",
		header: "flex items-center justify-between gap-2",
		grid: "w-full border-collapse",
		gridHeader: "",
		gridHeaderCell: "font-normal text-fg-muted text-xs",
		gridBody: "",
	},
	variants: {
		standalone: {
			true: {
				root: "rounded-md border bg-bg p-3",
			},
		},
	},
});

const defaultCellStyles = tv({
	slots: {
		cellRoot:
			"flex outside-month:hidden items-center justify-center outline-none selection-end:rounded-r-md selection-start:rounded-l-md",
		cell: [
			"focus-reset focus-visible:focus-ring",
			"my-1 flex size-8 cursor-pointer unavailable:cursor-default items-center justify-center rounded-md pressed:bg-inverse/20 text-sm unavailable:text-fg-disabled unavailable:not-data-disabled:line-through transition-colors read-only:cursor-default hover:bg-inverse/10 hover:unavailable:bg-transparent hover:read-only:bg-transparent disabled:cursor-default disabled:bg-transparent disabled:text-fg-disabled",
		],
	},
	variants: {
		variant: {
			primary: {},
			accent: {},
		},
		range: {
			true: {
				cellRoot: "selected: selected:bg-inverse/10 selected:invalid:bg-danger-muted selected:invalid:text-fg-danger",
				cell: "selection-end:invalid:bg-danger selection-start:invalid:bg-danger selection-end:invalid:text-fg-on-danger selection-start:invalid:text-fg-on-danger",
			},
			false: {
				cell: "selected:invalid:bg-danger selected:invalid:text-fg-on-danger",
			},
		},
	},
	compoundVariants: [
		{
			variant: "primary",
			range: false,
			className: {
				cell: "selected:bg-primary selected:text-fg-on-primary",
			},
		},
		{
			variant: "accent",
			range: false,
			className: {
				cell: "selected:bg-accent selected:text-fg-on-accent",
			},
		},
		{
			variant: "primary",
			range: true,
			className: {
				cell: "selection-end:bg-primary selection-start:bg-primary selection-end:text-fg-on-primary selection-start:text-fg-on-primary",
			},
		},
		{
			variant: "accent",
			range: true,
			className: {
				cell: "selection-end:bg-accent selection-start:bg-accent selection-end:text-fg-on-accent selection-start:text-fg-on-accent",
			},
		},
	],
	defaultVariants: {
		variant: "accent",
	},
});

export type CalendarStyles = typeof defaultStyles;
export type CalendarCellStyles = typeof defaultCellStyles;

export { defaultStyles as calendarStyles };

export const { useStyles } = createStyles(calendarMeta, {
	default: defaultStyles,
});

export const { useStyles: useCellStyles } = createStyles(calendarMeta, {
	default: defaultCellStyles,
});
