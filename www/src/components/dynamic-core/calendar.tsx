"use client";

import React from "react";
import { type DateValue } from "react-aria-components";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import {
  Calendar as _Calendar,
  CalendarRoot as _CalendarRoot,
  RangeCalendar as _RangeCalendar,
  RangeCalendarRoot as _RangeCalendarRoot,
  CalendarHeader as _CalendarHeader,
  CalendarGrid as _CalendarGrid,
  CalendarGridHeader as _CalendarGridHeader,
  CalendarHeaderCell as _CalendarHeaderCell,
  CalendarGridBody as _CalendarGridBody,
  CalendarCell as _CalendarCell,
} from "@/registry/core/calendar_basic";
import type {
  CalendarProps,
  CalendarRootProps,
  RangeCalendarProps,
  RangeCalendarRootProps,
  CalendarHeaderProps,
  CalendarGridProps,
  CalendarGridHeaderProps,
  CalendarHeaderCellProps,
  CalendarGridBodyProps,
  CalendarCellProps,
} from "@/registry/core/calendar_basic";

export const Calendar = createDynamicComponent<CalendarProps<DateValue>>(
  "calendar",
  "Calendar",
  _Calendar,
  {
    cal: React.lazy(() =>
      import("@/registry/core/calendar_cal").then((mod) => ({
        default: mod.Calendar,
      }))
    ),
  }
);

export const RangeCalendar = createDynamicComponent<
  RangeCalendarProps<DateValue>
>("calendar", "RangeCalendar", _RangeCalendar, {
  cal: React.lazy(() =>
    import("@/registry/core/calendar_cal").then((mod) => ({
      default: mod.RangeCalendar,
    }))
  ),
});

export const CalendarRoot = createDynamicComponent<
  CalendarRootProps<DateValue>
>("calendar", "CalendarRoot", _CalendarRoot, {
  cal: React.lazy(() =>
    import("@/registry/core/calendar_cal").then((mod) => ({
      default: mod.CalendarRoot,
    }))
  ),
});

export const RangeCalendarRoot = createDynamicComponent<
  RangeCalendarRootProps<DateValue>
>("calendar", "RangeCalendarRoot", _RangeCalendarRoot, {
  cal: React.lazy(() =>
    import("@/registry/core/calendar_cal").then((mod) => ({
      default: mod.RangeCalendarRoot,
    }))
  ),
});

export const CalendarHeader = createDynamicComponent<CalendarHeaderProps>(
  "calendar",
  "CalendarHeader",
  _CalendarHeader,
  {
    cal: React.lazy(() =>
      import("@/registry/core/calendar_cal").then((mod) => ({
        default: mod.CalendarHeader,
      }))
    ),
  }
);

export const CalendarGrid = createDynamicComponent<CalendarGridProps>(
  "calendar",
  "CalendarGrid",
  _CalendarGrid,
  {
    cal: React.lazy(() =>
      import("@/registry/core/calendar_cal").then((mod) => ({
        default: mod.CalendarGrid,
      }))
    ),
  }
);

export const CalendarGridHeader =
  createDynamicComponent<CalendarGridHeaderProps>(
    "calendar",
    "CalendarGridHeader",
    _CalendarGridHeader,
    {
      cal: React.lazy(() =>
        import("@/registry/core/calendar_cal").then((mod) => ({
          default: mod.CalendarGridHeader,
        }))
      ),
    }
  );

export const CalendarHeaderCell =
  createDynamicComponent<CalendarHeaderCellProps>(
    "calendar",
    "CalendarHeaderCell",
    _CalendarHeaderCell,
    {
      cal: React.lazy(() =>
        import("@/registry/core/calendar_cal").then((mod) => ({
          default: mod.CalendarHeaderCell,
        }))
      ),
    }
  );

export const CalendarGridBody = createDynamicComponent<CalendarGridBodyProps>(
  "calendar",
  "CalendarGridBody",
  _CalendarGridBody,
  {
    cal: React.lazy(() =>
      import("@/registry/core/calendar_cal").then((mod) => ({
        default: mod.CalendarGridBody,
      }))
    ),
  }
);

export const CalendarCell = createDynamicComponent<CalendarCellProps>(
  "calendar",
  "CalendarCell",
  _CalendarCell,
  {
    cal: React.lazy(() =>
      import("@/registry/core/calendar_cal").then((mod) => ({
        default: mod.CalendarCell,
      }))
    ),
  }
);
