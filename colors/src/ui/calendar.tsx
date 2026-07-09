'use client'

import type React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as CalendarPrimitive from 'react-aria-components/Calendar'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as RangeCalendarPrimitive from 'react-aria-components/RangeCalendar'
import { tv } from 'tailwind-variants'

import { Button } from '@/ui/button'
const calendarVariants = tv({
  slots: {
    root: 'flex w-fit max-w-full flex-col gap-4 [--cell-radius:var(--calendar-cell-radius)] [--cell-size:var(--calendar-cell-size)]',
    header: 'flex items-center gap-2',
    heading: 'flex-1 text-center text-sm font-medium',
    grid: 'grid grid-cols-7 gap-y-2',
    gridHeader: 'contents *:[tr]:contents',
    gridHeaderCell: 'text-xs font-normal text-fg-muted',
    gridBody: 'contents *:[tr]:contents',
    cell: [
      'relative flex aspect-square size-full items-center justify-center text-center text-sm font-medium no-highlight',
      'min-w-(--cell-size) cursor-interactive',
      'disabled:text-fg-disabled unavailable:text-fg-disabled unavailable:line-through outside-month:text-fg-disabled',
      'in-data-range-calendar:not-outside-month:selected:bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--color-bg))] selection-start:rounded-l-full selection-end:rounded-r-full',
      'in-data-range-calendar:[td:has(+td>[data-outside-month])>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)',
      'in-data-range-calendar:[td:has(>[data-outside-month])+td>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)',
      'in-data-range-calendar:[td:first-child>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)',
      'in-data-range-calendar:[td:last-child>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)',
      'focus-reset in-data-calendar:rounded-(--cell-radius) in-data-calendar:transition-shadow in-data-calendar:hover:bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--color-bg))] in-data-calendar:focus-visible:focus-ring in-data-calendar:selected:not-outside-month:bg-accent in-data-calendar:selected:not-outside-month:text-fg-on-accent',
      'outside-month:pointer-events-none',
      'in-data-calendar:not-outside-month:invalid:selected:bg-danger in-data-calendar:not-outside-month:invalid:selected:text-fg-on-danger',
    ],
    cellInner:
      'flex size-full items-center justify-center rounded-(--cell-radius) focus-reset transition-shadow not-in-selection-start:not-in-selection-end:hover:bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--color-bg))] in-focus-visible:focus-ring in-data-calendar:contents in-selection-start:not-in-outside-month:bg-accent in-selection-start:not-in-outside-month:text-fg-on-accent in-selection-end:not-in-outside-month:bg-accent in-selection-end:not-in-outside-month:text-fg-on-accent',
  },
})

interface CalendarProps<
  T extends CalendarPrimitive.DateValue,
> extends CalendarPrimitive.CalendarProps<T> {}
const Calendar = <T extends CalendarPrimitive.DateValue>({
  className,
  ...props
}: CalendarProps<T>) => {
  const { root } = calendarVariants()
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
  )
}

interface RangeCalendarProps<
  T extends CalendarPrimitive.DateValue,
> extends RangeCalendarPrimitive.RangeCalendarProps<T> {}
const RangeCalendar = <T extends CalendarPrimitive.DateValue>({
  className,
  ...props
}: RangeCalendarProps<T>) => {
  const { root } = calendarVariants()
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
  )
}

interface CalendarHeaderProps extends React.ComponentProps<'header'> {}
const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
  const { header } = calendarVariants()
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

interface CalendarHeadingProps extends React.ComponentProps<
  typeof CalendarPrimitive.Heading
> {}
const CalendarHeading = ({ className, ...props }: CalendarHeadingProps) => {
  const { heading } = calendarVariants()
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
  )
}

interface CalendarGridProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarGrid
> {}
const CalendarGrid = ({ className, children, ...props }: CalendarGridProps) => {
  const { grid } = calendarVariants()
  return (
    <CalendarPrimitive.CalendarGrid
      data-calendar-grid=""
      className={grid({ className })}
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
  )
}

interface CalendarGridHeaderProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarGridHeader
> {}
const CalendarGridHeader = ({
  className,
  ...props
}: CalendarGridHeaderProps) => {
  const { gridHeader } = calendarVariants()
  return (
    <CalendarPrimitive.CalendarGridHeader
      data-calendar-grid-header=""
      className={gridHeader({ className })}
      {...props}
    />
  )
}

interface CalendarHeaderCellProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarHeaderCell
> {}
const CalendarHeaderCell = ({
  className,
  ...props
}: CalendarHeaderCellProps) => {
  const { gridHeaderCell } = calendarVariants()
  return (
    <CalendarPrimitive.CalendarHeaderCell
      data-calendar-header-cell=""
      className={gridHeaderCell({ className })}
      {...props}
    />
  )
}

interface CalendarGridBodyProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarGridBody
> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
  const { gridBody } = calendarVariants()
  return (
    <CalendarPrimitive.CalendarGridBody
      data-calendar-grid-body=""
      className={gridBody({ className })}
      {...props}
    />
  )
}

interface CalendarCellProps extends React.ComponentProps<
  typeof CalendarPrimitive.CalendarCell
> {}
const CalendarCell = ({ className, ...props }: CalendarCellProps) => {
  const { cell, cellInner } = calendarVariants()
  return (
    <CalendarPrimitive.CalendarCell
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
    </CalendarPrimitive.CalendarCell>
  )
}

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
