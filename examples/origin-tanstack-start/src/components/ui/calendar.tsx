"use client";

import * as React from "react";
import * as CalendarPrimitives from "react-aria-components/Calendar";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as RangeCalendarPrimitives from "react-aria-components/RangeCalendar";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tv } from "tailwind-variants";

const calendarVariants = tv({
  slots: {
    root: "flex w-fit max-w-full flex-col gap-4 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)]",
    header: "flex items-center gap-2",
    heading: "flex-1 text-center font-sans text-sm font-medium tracking-normal",
    grid: "grid grid-cols-7 gap-y-2",
    gridHeader: "contents *:[tr]:contents",
    gridHeaderCell: "text-xs font-normal text-fg-muted",
    gridBody: "contents *:[tr]:contents",
    cell: "relative flex aspect-square size-full min-w-(--cell-size) items-center justify-center text-center text-sm font-medium no-highlight cursor-interactive transition-shadow outline-none disabled:text-(--disabled-fg,currentColor) unavailable:text-fg-disabled unavailable:line-through outside-month:pointer-events-none outside-month:text-fg-disabled in-data-calendar:rounded-(--cell-radius) selection-start:rounded-l-(--cell-radius) selection-end:rounded-r-(--cell-radius) in-data-range-calendar:[td:has(+td>[data-outside-month])>&[data-selected]:not([data-selection-end])]:rounded-r-(--cell-radius) in-data-range-calendar:[td:has(>[data-outside-month])+td>&[data-selected]:not([data-selection-start])]:rounded-l-(--cell-radius) in-data-range-calendar:[td:first-child>&[data-selected]:not([data-selection-start])]:rounded-l-(--cell-radius) in-data-range-calendar:[td:last-child>&[data-selected]:not([data-selection-end])]:rounded-r-(--cell-radius) in-data-calendar:data-today:not-selected:not-hover:bg-muted",
    cellInner:
      "rounded-(--cell-radius) group-selected/calendar-cell:not-group-selection-start/calendar-cell:not-group-selection-end/calendar-cell:rounded-[inherit] in-data-range-calendar:group-data-today/calendar-cell:not-group-selected/calendar-cell:not-hover:bg-muted",
  },
  variants: {
    range: {
      false: {
        cell: "not-selected:hover:bg-selection-muted selected:bg-selection selected:text-fg-on-selection focus-visible:focus-ring invalid:selected:bg-danger invalid:selected:text-fg-on-danger",
        cellInner: "contents",
      },
      true: {
        cell: "group/calendar-cell selected:bg-selection-muted",
        cellInner:
          "relative flex size-full items-center justify-center transition-shadow outline-none group-focus-visible/calendar-cell:focus-ring group-selection-start/calendar-cell:not-group-outside-month/calendar-cell:bg-selection group-selection-start/calendar-cell:not-group-outside-month/calendar-cell:text-fg-on-selection group-selection-end/calendar-cell:not-group-outside-month/calendar-cell:bg-selection group-selection-end/calendar-cell:not-group-outside-month/calendar-cell:text-fg-on-selection not-group-selection-start/calendar-cell:not-group-selection-end/calendar-cell:hover:bg-selection-muted",
      },
    },
  },
  defaultVariants: {
    range: false,
  },
});

const {
  root,
  header,
  heading,
  grid,
  gridHeader,
  gridHeaderCell,
  gridBody,
  cell,
  cellInner,
} = calendarVariants();

/* -------------------------------------------------------------------------- */

interface CalendarProps<
  T extends CalendarPrimitives.DateValue,
> extends CalendarPrimitives.CalendarProps<T> {}
const Calendar = <T extends CalendarPrimitives.DateValue>({
  className,
  ...props
}: CalendarProps<T>) => {
  return (
    <CalendarPrimitives.Calendar
      data-calendar=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
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
    </CalendarPrimitives.Calendar>
  );
};

/* -------------------------------------------------------------------------- */

interface RangeCalendarProps<
  T extends CalendarPrimitives.DateValue,
> extends RangeCalendarPrimitives.RangeCalendarProps<T> {}
const RangeCalendar = <T extends CalendarPrimitives.DateValue>({
  className,
  ...props
}: RangeCalendarProps<T>) => {
  return (
    <RangeCalendarPrimitives.RangeCalendar
      data-range-calendar=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
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
    </RangeCalendarPrimitives.RangeCalendar>
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarHeaderProps extends React.ComponentProps<"header"> {}
const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
  return (
    <header
      data-calendar-header=""
      className={header({ className })}
      {...props}
    >
      {props.children ?? (
        <>
          <Button slot="previous" variant="quiet" isIconOnly>
            <ChevronLeftIcon />
          </Button>
          <CalendarHeading />
          <Button slot="next" variant="quiet" isIconOnly>
            <ChevronRightIcon />
          </Button>
        </>
      )}
    </header>
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarHeadingProps extends React.ComponentProps<
  typeof CalendarPrimitives.Heading
> {}
const CalendarHeading = ({ className, ...props }: CalendarHeadingProps) => {
  // Intl's separator whitespace differs between Node and the browser, so the heading text can hydrate-mismatch.
  return (
    <CalendarPrimitives.Heading
      data-calendar-heading=""
      suppressHydrationWarning
      className={heading({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarGridProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarGrid
> {}
const CalendarGrid = ({
  className,
  children,
  weekdayStyle = "narrow",
  ...props
}: CalendarGridProps) => {
  return (
    <CalendarPrimitives.CalendarGrid
      data-calendar-grid=""
      className={grid({ className })}
      weekdayStyle={weekdayStyle}
      {...props}
    >
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
    </CalendarPrimitives.CalendarGrid>
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarGridHeaderProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarGridHeader
> {}
const CalendarGridHeader = ({
  className,
  children,
  ...props
}: CalendarGridHeaderProps) => {
  return (
    <CalendarPrimitives.CalendarGridHeader
      data-calendar-grid-header=""
      className={gridHeader({ className })}
      {...props}
    >
      {children}
    </CalendarPrimitives.CalendarGridHeader>
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarHeaderCellProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarHeaderCell
> {}
const CalendarHeaderCell = ({
  className,
  ...props
}: CalendarHeaderCellProps) => {
  return (
    <CalendarPrimitives.CalendarHeaderCell
      data-calendar-header-cell=""
      className={gridHeaderCell({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarGridBodyProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarGridBody
> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
  return (
    <CalendarPrimitives.CalendarGridBody
      data-calendar-grid-body=""
      className={gridBody({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarCellProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarCell
> {}
const CalendarCell = ({ className, ...props }: CalendarCellProps) => {
  const range =
    React.useContext(RangeCalendarPrimitives.RangeCalendarStateContext) !==
    null;
  return (
    <CalendarPrimitives.CalendarCell
      data-calendar-cell=""
      className={composeRenderProps(className, (className) =>
        cell({ range, className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { formattedDate }) => (
        <span data-cell-inner="" className={cellInner({ range })}>
          {children ?? formattedDate}
        </span>
      ))}
    </CalendarPrimitives.CalendarCell>
  );
};

/* -------------------------------------------------------------------------- */

export type {
  CalendarCellProps,
  CalendarGridBodyProps,
  CalendarGridHeaderProps,
  CalendarGridProps,
  CalendarHeaderCellProps,
  CalendarHeaderProps,
  CalendarHeadingProps,
  CalendarProps,
  RangeCalendarProps,
};
export {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar,
};
