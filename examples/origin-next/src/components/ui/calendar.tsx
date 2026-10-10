"use client";

import * as React from "react";
import * as CalendarPrimitive from "react-aria-components/Calendar";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as RangeCalendarPrimitive from "react-aria-components/RangeCalendar";

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
    cell: "relative flex aspect-square size-full min-w-(--cell-size) items-center justify-center text-center text-sm font-medium no-highlight cursor-interactive focus-reset transition-shadow disabled:text-(--disabled-fg,currentColor) unavailable:text-fg-disabled unavailable:line-through outside-month:pointer-events-none outside-month:text-fg-disabled in-data-calendar:rounded-(--cell-radius) selection-start:rounded-l-(--cell-radius) selection-end:rounded-r-(--cell-radius) in-data-range-calendar:[td:has(+td>[data-outside-month])>&[data-selected]:not([data-selection-end])]:rounded-r-(--cell-radius) in-data-range-calendar:[td:has(>[data-outside-month])+td>&[data-selected]:not([data-selection-start])]:rounded-l-(--cell-radius) in-data-range-calendar:[td:first-child>&[data-selected]:not([data-selection-start])]:rounded-l-(--cell-radius) in-data-range-calendar:[td:last-child>&[data-selected]:not([data-selection-end])]:rounded-r-(--cell-radius) in-data-calendar:data-today:not-selected:not-hover:bg-muted",
    cellInner:
      "rounded-(--cell-radius) in-selected:not-in-selection-start:not-in-selection-end:rounded-[inherit] in-data-range-calendar:in-data-today:not-in-selected:not-hover:bg-muted",
  },
  variants: {
    range: {
      false: {
        cell: "not-selected:hover:bg-selection-muted selected:bg-selection selected:text-fg-on-selection focus-visible:focus-ring invalid:selected:bg-danger invalid:selected:text-fg-on-danger",
        cellInner: "contents",
      },
      true: {
        cell: "selected:bg-selection-muted",
        cellInner:
          "relative flex size-full items-center justify-center focus-reset transition-shadow not-in-selection-start:not-in-selection-end:hover:bg-selection-muted in-focus-visible:focus-ring in-selection-start:not-in-outside-month:bg-selection in-selection-start:not-in-outside-month:text-fg-on-selection in-selection-end:not-in-outside-month:bg-selection in-selection-end:not-in-outside-month:text-fg-on-selection",
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
  T extends CalendarPrimitive.DateValue,
> extends CalendarPrimitive.CalendarProps<T> {}
const Calendar = <T extends CalendarPrimitive.DateValue>({
  className,
  ...props
}: CalendarProps<T>) => {
  return (
    <CalendarPrimitive.Calendar
      data-calendar=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children ?? (
            <>
              <CalendarHeader>
                <Button slot="previous" variant="quiet" isIconOnly>
                  <ChevronLeftIcon />
                </Button>
                <CalendarHeading />
                <Button slot="next" variant="quiet" isIconOnly>
                  <ChevronRightIcon />
                </Button>
              </CalendarHeader>
              <CalendarGrid />
            </>
          )}
        </>
      ))}
    </CalendarPrimitive.Calendar>
  );
};

/* -------------------------------------------------------------------------- */

interface RangeCalendarProps<
  T extends CalendarPrimitive.DateValue,
> extends RangeCalendarPrimitive.RangeCalendarProps<T> {}
const RangeCalendar = <T extends CalendarPrimitive.DateValue>({
  className,
  ...props
}: RangeCalendarProps<T>) => {
  return (
    <RangeCalendarPrimitive.RangeCalendar
      data-range-calendar=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children ?? (
            <>
              <CalendarHeader>
                <Button slot="previous" variant="quiet" isIconOnly>
                  <ChevronLeftIcon />
                </Button>
                <CalendarHeading />
                <Button slot="next" variant="quiet" isIconOnly>
                  <ChevronRightIcon />
                </Button>
              </CalendarHeader>
              <CalendarGrid />
            </>
          )}
        </>
      ))}
    </RangeCalendarPrimitive.RangeCalendar>
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
  typeof CalendarPrimitive.Heading
> {}
const CalendarHeading = ({ className, ...props }: CalendarHeadingProps) => {
  // The heading text (e.g. a "June – July 2026" range) is formatted with `Intl`, whose separator
  // whitespace differs between the Node SSR runtime and the browser, causing a hydration mismatch.
  // The difference is an invisible space-variant, so suppress the otherwise-harmless warning.
  return (
    <CalendarPrimitive.Heading
      data-calendar-heading=""
      suppressHydrationWarning
      className={heading({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarGridProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarGrid
> {}
const CalendarGrid = ({
  className,
  children,
  weekdayStyle = "narrow",
  ...props
}: CalendarGridProps) => {
  return (
    <CalendarPrimitive.CalendarGrid
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
    </CalendarPrimitive.CalendarGrid>
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarGridHeaderProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarGridHeader
> {}
const CalendarGridHeader = ({
  className,
  children,
  ...props
}: CalendarGridHeaderProps) => {
  return (
    <CalendarPrimitive.CalendarGridHeader
      data-calendar-grid-header=""
      className={gridHeader({ className })}
      {...props}
    >
      {children}
    </CalendarPrimitive.CalendarGridHeader>
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarHeaderCellProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarHeaderCell
> {}
const CalendarHeaderCell = ({
  className,
  ...props
}: CalendarHeaderCellProps) => {
  return (
    <CalendarPrimitive.CalendarHeaderCell
      data-calendar-header-cell=""
      className={gridHeaderCell({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarGridBodyProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarGridBody
> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
  return (
    <CalendarPrimitive.CalendarGridBody
      data-calendar-grid-body=""
      className={gridBody({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface CalendarCellProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarCell
> {}
const CalendarCell = ({ className, ...props }: CalendarCellProps) => {
  const range =
    React.useContext(RangeCalendarPrimitive.RangeCalendarStateContext) !== null;
  return (
    <CalendarPrimitive.CalendarCell
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
    </CalendarPrimitive.CalendarCell>
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
