"use client"

import * as React from "react"
import * as CalendarPrimitives from "react-aria-components/Calendar"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as RangeCalendarPrimitives from "react-aria-components/RangeCalendar"

import { ChevronLeftIcon, ChevronRightIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"

import { useStyles } from "./styles"

// MARK: calendarStyles

// MARK: Separator

interface CalendarProps<
  T extends CalendarPrimitives.DateValue,
> extends CalendarPrimitives.CalendarProps<T> {}
const Calendar = <T extends CalendarPrimitives.DateValue>({
  className,
  ...props
}: CalendarProps<T>) => {
  const { root } = useStyles()()
  return (
    <CalendarPrimitives.Calendar
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
    </CalendarPrimitives.Calendar>
  )
}

// MARK: Separator

interface RangeCalendarProps<
  T extends CalendarPrimitives.DateValue,
> extends RangeCalendarPrimitives.RangeCalendarProps<T> {}
const RangeCalendar = <T extends CalendarPrimitives.DateValue>({
  className,
  ...props
}: RangeCalendarProps<T>) => {
  const { root } = useStyles()()
  return (
    <RangeCalendarPrimitives.RangeCalendar
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
    </RangeCalendarPrimitives.RangeCalendar>
  )
}

// MARK: Separator

interface CalendarHeaderProps extends React.ComponentProps<"header"> {}
const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
  const { header } = useStyles()()
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
  )
}

// MARK: Separator

interface CalendarHeadingProps extends React.ComponentProps<
  typeof CalendarPrimitives.Heading
> {}
const CalendarHeading = ({ className, ...props }: CalendarHeadingProps) => {
  const { heading } = useStyles()()
  // Intl's separator whitespace differs between Node and the browser, so the heading text can hydrate-mismatch.
  return (
    <CalendarPrimitives.Heading
      data-calendar-heading=""
      suppressHydrationWarning
      className={heading({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface CalendarGridProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarGrid
> {}
const CalendarGrid = ({
  className,
  children,
  weekdayStyle = "narrow",
  ...props
}: CalendarGridProps) => {
  const { grid } = useStyles()()
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
  )
}

// MARK: Separator

interface CalendarGridHeaderProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarGridHeader
> {}
const CalendarGridHeader = ({
  className,
  children,
  ...props
}: CalendarGridHeaderProps) => {
  const { gridHeader } = useStyles()()
  return (
    <CalendarPrimitives.CalendarGridHeader
      data-calendar-grid-header=""
      className={gridHeader({ className })}
      {...props}
    >
      {children}
    </CalendarPrimitives.CalendarGridHeader>
  )
}

// MARK: Separator

interface CalendarHeaderCellProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarHeaderCell
> {}
const CalendarHeaderCell = ({
  className,
  ...props
}: CalendarHeaderCellProps) => {
  const { gridHeaderCell } = useStyles()()
  return (
    <CalendarPrimitives.CalendarHeaderCell
      data-calendar-header-cell=""
      className={gridHeaderCell({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface CalendarGridBodyProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarGridBody
> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
  const { gridBody } = useStyles()()
  return (
    <CalendarPrimitives.CalendarGridBody
      data-calendar-grid-body=""
      className={gridBody({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface CalendarCellProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarCell
> {}
const CalendarCell = ({ className, ...props }: CalendarCellProps) => {
  const range =
    React.useContext(RangeCalendarPrimitives.RangeCalendarStateContext) !== null
  const { cell, cellInner } = useStyles()({ range })
  return (
    <CalendarPrimitives.CalendarCell
      data-calendar-cell=""
      className={composeRenderProps(className, (className) =>
        cell({
          className,
        }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { formattedDate }) => (
        <span data-cell-inner="" className={cellInner()}>
          {children ?? formattedDate}
        </span>
      ))}
    </CalendarPrimitives.CalendarCell>
  )
}

// MARK: Separator

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
}
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
}
