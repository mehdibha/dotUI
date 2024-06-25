"use client";

import * as React from "react";
import {
  composeRenderProps,
  RangeCalendar as AriaRangeCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  Heading as AriaHeading,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarGridBody as AriaCalendarGridBody,
  Text as AriaText,
  type RangeCalendarProps as AriaRangeCalendarProps,
  type DateValue,
} from "react-aria-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";
import { Button } from "./button";
import { calendarStyles } from "./calendar";

interface RangeCalendarProps<T extends DateValue>
  extends Omit<AriaRangeCalendarProps<T>, "className" | "visibleDuration"> {
  visibleMonths?: number;
  className?: string;
  errorMessage?: string;
}
const RangeCalendar = <T extends DateValue>({
  className,
  visibleMonths = 1,
  errorMessage,
  ...props
}: RangeCalendarProps<T>) => {
  const { root, header, heading, grid, gridHeader, gridHeaderCell, gridBody, cell } =
    calendarStyles({ range: true });
  visibleMonths = Math.min(Math.max(visibleMonths, 1), 3);
  return (
    <AriaRangeCalendar
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
                  {(date) => (
                    <AriaCalendarCell date={date} className={cell()}>
                      {({ formattedDate }) => <span className="z-20">{formattedDate}</span>}
                    </AriaCalendarCell>
                  )}
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
    </AriaRangeCalendar>
  );
};

export type { RangeCalendarProps };
export { RangeCalendar };
