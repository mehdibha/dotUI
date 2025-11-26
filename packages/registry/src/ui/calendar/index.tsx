"use client";

import type { DateValue } from "react-aria-components";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Calendar as _Calendar,
  CalendarCell as _CalendarCell,
  CalendarGrid as _CalendarGrid,
  CalendarGridBody as _CalendarGridBody,
  CalendarGridHeader as _CalendarGridHeader,
  CalendarHeader as _CalendarHeader,
  CalendarHeaderCell as _CalendarHeaderCell,
} from "./basic";
import type {
  CalendarCellProps,
  CalendarGridBodyProps,
  CalendarGridHeaderProps,
  CalendarGridProps,
  CalendarHeaderCellProps,
  CalendarHeaderProps,
  CalendarProps,
} from "./types";

export const Calendar = createDynamicComponent<CalendarProps<DateValue>>(
  "calendar",
  "Calendar",
  _Calendar,
  {},
);

export const CalendarHeader = createDynamicComponent<CalendarHeaderProps>(
  "calendar",
  "CalendarHeader",
  _CalendarHeader,
  {},
);

export const CalendarGrid = createDynamicComponent<CalendarGridProps>(
  "calendar",
  "CalendarGrid",
  _CalendarGrid,
  {},
);

export const CalendarGridHeader =
  createDynamicComponent<CalendarGridHeaderProps>(
    "calendar",
    "CalendarGridHeader",
    _CalendarGridHeader,
    {},
  );

export const CalendarHeaderCell =
  createDynamicComponent<CalendarHeaderCellProps>(
    "calendar",
    "CalendarHeaderCell",
    _CalendarHeaderCell,
    {},
  );

export const CalendarGridBody = createDynamicComponent<CalendarGridBodyProps>(
  "calendar",
  "CalendarGridBody",
  _CalendarGridBody,
  {},
);

export const CalendarCell = createDynamicComponent<CalendarCellProps>(
  "calendar",
  "CalendarCell",
  _CalendarCell,
  {},
);
