import { createStyles } from "@/modules/core/styles";

import calendarMeta from "./meta";

const { useStyles, styles } = createStyles(calendarMeta, {
	base: {
		slots: {
			root: "flex w-fit max-w-full flex-col gap-4 [--cell-radius:var(--calendar-cell-radius)] [--cell-size:var(--calendar-cell-size)]",
			header: "flex items-center gap-2",
			heading: "flex-1 text-center font-medium text-sm",
			grid: "grid grid-cols-7 gap-y-2",
			gridHeader: "contents *:[tr]:contents",
			gridHeaderCell: "font-normal text-fg-muted text-xs",
			gridBody: "contents *:[tr]:contents",
			cell: [
				"no-highlight relative flex aspect-square size-full items-center justify-center text-center font-medium text-sm",
				"min-w-(--cell-size) cursor-interactive",
				"outside-month:text-fg-disabled unavailable:text-fg-disabled unavailable:line-through disabled:text-fg-disabled",
				"in-data-range-calendar:not-outside-month:selected:bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--color-bg))] selection-end:rounded-r-full selection-start:rounded-l-full",
				// range radius
				"in-data-range-calendar:[td:has(+td>[data-outside-month])>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)",
				"in-data-range-calendar:[td:has(>[data-outside-month])+td>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)",
				"in-data-range-calendar:[td:first-child>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)",
				"in-data-range-calendar:[td:last-child>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)",
				// single mode
				"focus-reset in-data-calendar:focus-visible:focus-ring in-data-calendar:rounded-(--cell-radius) in-data-calendar:selected:not-outside-month:bg-accent in-data-calendar:selected:not-outside-month:text-fg-on-accent in-data-calendar:transition-shadow in-data-calendar:hover:bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--color-bg))]",
				"outside-month:pointer-events-none",
				//invalid,
				"in-data-calendar:not-outside-month:invalid:selected:bg-danger in-data-calendar:not-outside-month:invalid:selected:text-fg-on-danger",
			],
			cellInner:
				"focus-reset in-focus-visible:focus-ring flex in-data-calendar:contents size-full items-center justify-center rounded-(--cell-radius) in-selection-end:not-in-outside-month:bg-accent in-selection-start:not-in-outside-month:bg-accent in-selection-end:not-in-outside-month:text-fg-on-accent in-selection-start:not-in-outside-month:text-fg-on-accent transition-shadow not-in-selection-start:not-in-selection-end:hover:bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--color-bg))]",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
	styles: {
		default: {
			slots: {
				root: "",
				header: "",
				heading: "",
				grid: "",
				gridHeader: "",
				gridHeaderCell: "",
				gridBody: "",
				cell: "",
			},
		},
	},
});

export type CalendarStyles = typeof styles;

export { useStyles, styles as calendarStyles };
