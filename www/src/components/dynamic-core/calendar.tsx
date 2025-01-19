"use client";

import React from "react";
import { type DateValue } from "react-aria-components";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
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
  {
    calendar_basic: React.lazy(() =>
      import("@/registry/core/calendar_basic").then((mod) => ({
        default: mod.Calendar,
      }))
    ),
    calendar_cal: React.lazy(() =>
      import("@/registry/core/calendar_cal").then((mod) => ({
        default: mod.Calendar,
      }))
    ),
  }
);

export const RangeCalendar = createDynamicComponent<
  RangeCalendarProps<DateValue>
>("calendar", "RangeCalendar", {
  calendar_basic: React.lazy(() =>
    import("@/registry/core/calendar_basic").then((mod) => ({
      default: mod.RangeCalendar,
    }))
  ),
  calendar_cal: React.lazy(() =>
    import("@/registry/core/calendar_cal").then((mod) => ({
      default: mod.RangeCalendar,
    }))
  ),
});

export const CalendarRoot = createDynamicComponent<
  CalendarRootProps<DateValue>
>("calendar", "CalendarRoot", {
  calendar_basic: React.lazy(() =>
    import("@/registry/core/calendar_basic").then((mod) => ({
      default: mod.CalendarRoot,
    }))
  ),
  // @ts-ignore
  calendar_cal: React.lazy(() =>
    import("@/registry/core/calendar_cal").then((mod) => ({
      default: mod.CalendarRoot,
    }))
  ),
});

export const RangeCalendarRoot = createDynamicComponent<
  RangeCalendarRootProps<DateValue>
>("calendar", "RangeCalendarRoot", {
  calendar_basic: React.lazy(() =>
    import("@/registry/core/calendar_basic").then((mod) => ({
      default: mod.RangeCalendarRoot,
    }))
  ),
  // @ts-ignore
  calendar_cal: React.lazy(() =>
    import("@/registry/core/calendar_cal").then((mod) => ({
      default: mod.RangeCalendarRoot,
    }))
  ),
});

export const CalendarHeader = createDynamicComponent<CalendarHeaderProps>(
  "calendar",
  "CalendarHeader",
  {
    calendar_basic: React.lazy(() =>
      import("@/registry/core/calendar_basic").then((mod) => ({
        default: mod.CalendarHeader,
      }))
    ),
    calendar_cal: React.lazy(() =>
      import("@/registry/core/calendar_cal").then((mod) => ({
        default: mod.CalendarHeader,
      }))
    ),
  }
);

export const CalendarGrid = createDynamicComponent<CalendarGridProps>(
  "calendar",
  "CalendarGrid",
  {
    calendar_basic: React.lazy(() =>
      import("@/registry/core/calendar_basic").then((mod) => ({
        default: mod.CalendarGrid,
      }))
    ),
    calendar_cal: React.lazy(() =>
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
    {
      calendar_basic: React.lazy(() =>
        import("@/registry/core/calendar_basic").then((mod) => ({
          default: mod.CalendarGridHeader,
        }))
      ),
      calendar_cal: React.lazy(() =>
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
    {
      calendar_basic: React.lazy(() =>
        import("@/registry/core/calendar_basic").then((mod) => ({
          default: mod.CalendarHeaderCell,
        }))
      ),
      calendar_cal: React.lazy(() =>
        import("@/registry/core/calendar_cal").then((mod) => ({
          default: mod.CalendarHeaderCell,
        }))
      ),
    }
  );

export const CalendarGridBody = createDynamicComponent<CalendarGridBodyProps>(
  "calendar",
  "CalendarGridBody",
  {
    calendar_basic: React.lazy(() =>
      import("@/registry/core/calendar_basic").then((mod) => ({
        default: mod.CalendarGridBody,
      }))
    ),
    calendar_cal: React.lazy(() =>
      import("@/registry/core/calendar_cal").then((mod) => ({
        default: mod.CalendarGridBody,
      }))
    ),
  }
);

export const CalendarCell = createDynamicComponent<CalendarCellProps>(
  "calendar",
  "CalendarCell",
  {
    calendar_basic: React.lazy(() =>
      import("@/registry/core/calendar_basic").then((mod) => ({
        default: mod.CalendarCell,
      }))
    ),
    calendar_cal: React.lazy(() =>
      import("@/registry/core/calendar_cal").then((mod) => ({
        default: mod.CalendarCell,
      }))
    ),
  }
);
