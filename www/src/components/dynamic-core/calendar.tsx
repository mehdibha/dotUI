"use client";

import React from "react";
import { DateValue } from "react-aria-components";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import {
  CalendarProps,
  CalendarRootProps,
  CalendarGridProps,
  CalendarGridHeaderProps,
  CalendarHeaderCellProps,
  CalendarGridBodyProps,
  CalendarCellProps,
} from "@/registry/core/calendar-01";

export const Calendar = createDynamicComponent<CalendarProps<DateValue>>(
  "calendar",
  "Calendar",
  {
    "calendar-01": React.lazy(() =>
      import("@/__registry__/core/calendar-01").then((module) => ({
        default: module.Calendar,
      }))
    ),
  }
);

export const CalendarRoot = createDynamicComponent<
  CalendarRootProps<DateValue>
>("calendar", "CalendarRoot", {
  "calendar-01": React.lazy(() =>
    import("@/__registry__/core/calendar-01").then((module) => ({
      default: module.CalendarRoot,
    }))
  ),
});

export const CalendarHeader = createDynamicComponent<
  React.HTMLAttributes<HTMLElement>
>("calendar", "CalendarHeader", {
  "calendar-01": React.lazy(() =>
    import("@/__registry__/core/calendar-01").then((module) => ({
      default: module.CalendarHeader,
    }))
  ),
});

export const CalendarGrid = createDynamicComponent<CalendarGridProps>(
  "calendar",
  "CalendarGrid",
  {
    "calendar-01": React.lazy(() =>
      import("@/__registry__/core/calendar-01").then((module) => ({
        default: module.CalendarGrid,
      }))
    ),
  }
);

export const CalendarGridHeader =
  createDynamicComponent<CalendarGridHeaderProps>(
    "calendar",
    "CalendarGridHeader",
    {
      "calendar-01": React.lazy(() =>
        import("@/__registry__/core/calendar-01").then((module) => ({
          default: module.CalendarGridHeader,
        }))
      ),
    }
  );

export const CalendarHeaderCell =
  createDynamicComponent<CalendarHeaderCellProps>(
    "calendar",
    "CalendarHeaderCell",
    {
      "calendar-01": React.lazy(() =>
        import("@/__registry__/core/calendar-01").then((module) => ({
          default: module.CalendarHeaderCell,
        }))
      ),
    }
  );

export const CalendarGridBody = createDynamicComponent<CalendarGridBodyProps>(
  "calendar",
  "CalendarGridBody",
  {
    "calendar-01": React.lazy(() =>
      import("@/__registry__/core/calendar-01").then((module) => ({
        default: module.CalendarGridBody,
      }))
    ),
  }
);

export const CalendarCell = createDynamicComponent<CalendarCellProps>(
  "calendar",
  "CalendarCell",
  {
    "calendar-01": React.lazy(() =>
      import("@/__registry__/core/calendar-01").then((module) => ({
        default: module.CalendarCell,
      }))
    ),
  }
);
