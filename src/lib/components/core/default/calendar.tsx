"use client";

import * as React from "react";
import {
  composeRenderProps,
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  Heading as AriaHeading,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarGridBody as AriaCalendarGridBody,
  Text as AriaText,
  type CalendarProps as AriaCalendarProps,
  type DateValue,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";
import { Button, buttonStyles } from "./button";

const calendarStyles = tv({
  slots: {
    root: "w-fit max-w-full rounded-md border bg-bg p-3",
    header: "mb-4 flex items-center justify-between gap-2",
    heading: "text-sm font-medium",
    grid: "w-full border-collapse",
    gridHeader: "mb-4",
    gridHeaderCell: "text-xs font-normal text-fg-muted",
    gridBody: "[&>tr>td]:p-0",
    cell: "",
  },
  variants: {
    range: {
      false: {
        cell: [
          buttonStyles({
            variant: "quiet",
            shape: "square",
            size: "sm",
          }),
          "my-1 selected:bg-bg-primary selected:text-fg-onPrimary disabled:cursor-default disabled:bg-transparent",
          "selected:invalid:bg-bg-danger selected:invalid:text-fg-onDanger",
          "unavailable:line-through unavailable:hover:bg-transparent unavailable:cursor-default",
          "outside-month:hidden",
        ],
      },
      true: {
        cell: [
          "relative my-1 flex size-8 items-center justify-center rounded-md text-sm font-normal leading-normal disabled:cursor-default disabled:bg-transparent disabled:text-fg-disabled",
          "after:absolute after:inset-0 after:transition-colors after:content-[''] selected:after:bg-bg-primary/10",
          "before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:transition-colors before:content-[''] hover:before:bg-bg-inverse/10",
          "outline-none before:border before:border-transparent before:ring-0 before:ring-border-focus focus-visible:z-50 focus-visible:before:border-border focus-visible:before:ring-2 focus-visible:before:ring-offset-2 focus-visible:before:ring-offset-bg",
          "selection-start:after:rounded-l-[inherit] selection-end:after:rounded-r-[inherit]",
          "selection-start:pressed:before:bg-primary/90 selection-start:text-fg-onPrimary selection-start:before:bg-bg-primary",
          "selection-end:pressed:before:bg-primary/90 selection-end:text-fg-onPrimary selection-end:before:bg-bg-primary",
          "selected:invalid:after:bg-bg-danger selected:invalid:[&:not([data-selection-start])]:[&:not([data-selection-end])]:text-fg-onDanger",
          "unavailable:line-through unavailable:hover:bg-transparent unavailable:cursor-default",
          "outside-month:hidden",
        ],
      },
    },
  },
  defaultVariants: {
    range: false,
  },
});

interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, "className" | "visibleDuration"> {
  visibleMonths?: number;
  className?: string;
  errorMessage?: string;
}
const Calendar = <T extends DateValue>({
  className,
  errorMessage,
  visibleMonths = 1,
  ...props
}: CalendarProps<T>) => {
  const { root, header, heading, grid, gridHeader, gridHeaderCell, gridBody, cell } =
    calendarStyles();
  visibleMonths = Math.min(Math.max(visibleMonths, 1), 3);

  return (
    <AriaCalendar
      visibleDuration={{ months: visibleMonths }}
      className={root({ className })}
      {...props}
    >
      {composeRenderProps(props.children, (_, { isInvalid }) => (
        <>
          <header className={header()}>
            <Button slot="previous" variant="outline" shape="square" size="sm">
              <ChevronLeftIcon />
            </Button>
            <AriaHeading className={heading()} />
            <Button slot="next" variant="outline" shape="square" size="sm">
              <ChevronRightIcon />
            </Button>
          </header>
          <div className="flex items-start gap-4">
            {Array.from({ length: visibleMonths }).map((_, index) => (
              <AriaCalendarGrid
                key={index}
                className={grid()}
                offset={index === 0 ? undefined : { months: index }}
              >
                <AriaCalendarGridHeader className={gridHeader()}>
                  {(day) => (
                    <AriaCalendarHeaderCell className={gridHeaderCell()}>
                      {day}
                    </AriaCalendarHeaderCell>
                  )}
                </AriaCalendarGridHeader>
                <AriaCalendarGridBody className={gridBody()}>
                  {(date) => <AriaCalendarCell date={date} className={cell()} />}
                </AriaCalendarGridBody>
              </AriaCalendarGrid>
            ))}
          </div>
          {isInvalid && errorMessage && (
            <AriaText slot="errorMessage" className="text-sm text-fg-danger">
              {errorMessage}
            </AriaText>
          )}
        </>
      ))}
    </AriaCalendar>
  );
};

export type { CalendarProps };
export { Calendar, calendarStyles };
