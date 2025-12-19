"use client";

import type { DateValue } from "react-aria-components";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type {
	CalendarCellProps,
	CalendarGridBodyProps,
	CalendarGridHeaderProps,
	CalendarGridProps,
	CalendarHeaderCellProps,
	CalendarHeaderProps,
	CalendarProps,
} from "./types";

export const Calendar = createDynamicComponent<CalendarProps<DateValue>>("calendar", "Calendar", Default.Calendar, {});

export const CalendarHeader = createDynamicComponent<CalendarHeaderProps>(
	"calendar",
	"CalendarHeader",
	Default.CalendarHeader,
	{},
);

export const CalendarGrid = createDynamicComponent<CalendarGridProps>(
	"calendar",
	"CalendarGrid",
	Default.CalendarGrid,
	{},
);

export const CalendarGridHeader = createDynamicComponent<CalendarGridHeaderProps>(
	"calendar",
	"CalendarGridHeader",
	Default.CalendarGridHeader,
	{},
);

export const CalendarHeaderCell = createDynamicComponent<CalendarHeaderCellProps>(
	"calendar",
	"CalendarHeaderCell",
	Default.CalendarHeaderCell,
	{},
);

export const CalendarGridBody = createDynamicComponent<CalendarGridBodyProps>(
	"calendar",
	"CalendarGridBody",
	Default.CalendarGridBody,
	{},
);

export const CalendarCell = createDynamicComponent<CalendarCellProps>(
	"calendar",
	"CalendarCell",
	Default.CalendarCell,
	{},
);
