"use client"

import type * as CalendarPrimitive from "react-aria-components/Calendar"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { useComponentParams } from "@/lib/styles"

import {
  Calendar as BaseCalendar,
  CalendarCell,
  CalendarGrid as BaseCalendarGrid,
  CalendarGridBody,
  CalendarGridHeader as BaseCalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  RangeCalendar as BaseRangeCalendar,
} from "./base"
import type {
  CalendarGridHeaderProps,
  CalendarGridProps,
  CalendarProps,
  RangeCalendarProps,
} from "./base"

// The `weekdays` param is source the shipped file carries (meta.ts `source`);
// here it rides the design-system context, so every default composition
// below has to reach these wrappers, not base's.
const CalendarGridHeader = ({
  children,
  ...props
}: CalendarGridHeaderProps) => {
  const { weekdays } = useComponentParams("calendar")
  return (
    <BaseCalendarGridHeader {...props}>
      {weekdays === "double" ? (day) => children(day.slice(0, 2)) : children}
    </BaseCalendarGridHeader>
  )
}

const CalendarGrid = ({ children, ...props }: CalendarGridProps) => {
  const { weekdays } = useComponentParams("calendar")
  const single = weekdays !== "double" && weekdays !== "triple"
  return (
    <BaseCalendarGrid weekdayStyle={single ? "narrow" : "short"} {...props}>
      {children ?? (
        <>
          <CalendarGridHeader>
            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </>
      )}
    </BaseCalendarGrid>
  )
}

const Calendar = <T extends CalendarPrimitive.DateValue>(
  props: CalendarProps<T>,
) => {
  return (
    <BaseCalendar {...props}>
      {composeRenderProps(
        props.children,
        (children) =>
          children ?? (
            <>
              <CalendarHeader />
              <CalendarGrid />
            </>
          ),
      )}
    </BaseCalendar>
  )
}

const RangeCalendar = <T extends CalendarPrimitive.DateValue>(
  props: RangeCalendarProps<T>,
) => {
  return (
    <BaseRangeCalendar {...props}>
      {composeRenderProps(
        props.children,
        (children) =>
          children ?? (
            <>
              <CalendarHeader />
              <CalendarGrid />
            </>
          ),
      )}
    </BaseRangeCalendar>
  )
}

export * from "./base"
export { Calendar, CalendarGrid, CalendarGridHeader, RangeCalendar }
