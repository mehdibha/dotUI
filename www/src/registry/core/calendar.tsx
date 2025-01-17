"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Calendar as AriaCalendar,
  RangeCalendar as AriaRangeCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarContext as AriaCalendarContext,
  RangeCalendarContext as AriaRangeCalendarContext,
  composeRenderProps,
  useSlottedContext,
} from "react-aria-components";
import type {
  DateValue,
  CalendarProps as AriaCalendarProps,
  RangeCalendarProps as AriaRangeCalendarProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button } from "@/registry/core/button-01";
import { Heading } from "@/registry/core/heading";
import { Text } from "@/registry/core/text";

const calendarStyles = tv({
  slots: {
    root: "",
    header: "",
    grid: "",
    gridHeader: "",
    gridHeaderCell: "",
    gridBody: "",
    cell: "",
  },
  variants: {
    variant: {
      default: "",
      accent: "",
    },
    standalone: {
      true: {
        root: "bg-bg rounded-md border p-3",
      },
    },
    range: {
      true: {},
    },
  },
});

const { root, header, grid, gridHeader, gridHeaderCell, gridBody, cell } =
  calendarStyles();

interface CalendarProps<T extends DateValue>
  extends Omit<CalendarRootProps<T>, "visibleDuration"> {
  visibleMonths?: number;
  errorMessage?: string;
}
const Calendar = <T extends DateValue>({
  visibleMonths = 1,
  errorMessage,
  ...props
}: CalendarProps<T>) => {
  visibleMonths = Math.min(Math.max(visibleMonths, 1), 3);
  return (
    <CalendarRoot {...props}>
      {({ isInvalid }) => (
        <>
          <CalendarHeader>
            <Button slot="previous" variant="outline" shape="square" size="sm">
              <ChevronLeftIcon />
            </Button>
            <Heading className="text-sm" />
            <Button slot="next" variant="outline" shape="square" size="sm">
              <ChevronRightIcon />
            </Button>
          </CalendarHeader>
          <div className="flex items-start gap-4">
            {Array.from({ length: visibleMonths }).map((_, index) => (
              <CalendarGrid
                key={index}
                offset={index === 0 ? undefined : { months: index }}
              >
                <CalendarGridHeader>
                  {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                </CalendarGridHeader>
                <CalendarGridBody>
                  {(date) => <CalendarCell date={date} />}
                </CalendarGridBody>
              </CalendarGrid>
            ))}
          </div>
          {isInvalid && errorMessage && (
            <Text slot="errorMessage">{errorMessage}</Text>
          )}
        </>
      )}
    </CalendarRoot>
  );
};

interface RangeCalendarProps<T extends DateValue>
  extends Omit<RangeCalendarRootProps<T>, "visibleDuration"> {
  visibleMonths?: number;
  errorMessage?: string;
}
const RangeCalendar = <T extends DateValue>({
  visibleMonths = 1,
  errorMessage,
  ...props
}: RangeCalendarProps<T>) => {
  visibleMonths = Math.min(Math.max(visibleMonths, 1), 3);
  return (
    <RangeCalendarRoot visibleDuration={{ months: visibleMonths }} {...props}>
      {({ isInvalid }) => (
        <>
          <CalendarHeader>
            <Button slot="previous" variant="outline" shape="square" size="sm">
              <ChevronLeftIcon />
            </Button>
            <Heading className="text-sm" />
            <Button slot="next" variant="outline" shape="square" size="sm">
              <ChevronRightIcon />
            </Button>
          </CalendarHeader>
          <div className="flex items-start gap-4">
            {Array.from({ length: visibleMonths }).map((_, index) => (
              <CalendarGrid
                key={index}
                offset={index === 0 ? undefined : { months: index }}
              >
                <CalendarGridHeader>
                  {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                </CalendarGridHeader>
                <CalendarGridBody>
                  {(date) => (
                    <CalendarCell date={date} range>
                      {({ formattedDate }) => (
                        <span className="z-20">{formattedDate}</span>
                      )}
                    </CalendarCell>
                  )}
                </CalendarGridBody>
              </CalendarGrid>
            ))}
          </div>
          {isInvalid && errorMessage && (
            <Text slot="errorMessage">{errorMessage}</Text>
          )}
        </>
      )}
    </RangeCalendarRoot>
  );
};

interface CalendarRootProps<T extends DateValue> extends AriaCalendarProps<T> {}
const CalendarRoot = <T extends DateValue>({
  className,
  ...props
}: CalendarRootProps<T>) => {
  const CalendarContext = useSlottedContext(AriaCalendarContext);
  const standalone = Object.keys(CalendarContext ?? {}).length === 0;
  return (
    <AriaCalendar
      className={composeRenderProps(className, (className) =>
        root({ standalone, className })
      )}
      {...props}
    />
  );
};

interface RangeCalendarRootProps<T extends DateValue>
  extends AriaRangeCalendarProps<T> {}
const RangeCalendarRoot = <T extends DateValue>({
  className,
  ...props
}: RangeCalendarRootProps<T>) => {
  const CalendarContext = useSlottedContext(AriaRangeCalendarContext);
  const standalone = Object.keys(CalendarContext ?? {}).length === 0;
  return (
    <AriaRangeCalendar
      className={composeRenderProps(className, (className) =>
        root({ range: true, standalone, className })
      )}
      {...props}
    />
  );
};

interface CalendarHeaderProps extends React.ComponentProps<"header"> {}
const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
  return <header className={header({ className })} {...props} />;
};

interface CalendarGridProps
  extends React.ComponentProps<typeof AriaCalendarGrid> {}
const CalendarGrid = ({ className, ...props }: CalendarGridProps) => {
  return <AriaCalendarGrid className={grid({ className })} {...props} />;
};

interface CalendarGridHeaderProps
  extends React.ComponentProps<typeof AriaCalendarGridHeader> {}
const CalendarGridHeader = ({
  className,
  ...props
}: CalendarGridHeaderProps) => {
  return (
    <AriaCalendarGridHeader className={gridHeader({ className })} {...props} />
  );
};

interface CalendarHeaderCellProps
  extends React.ComponentProps<typeof AriaCalendarHeaderCell> {}
const CalendarHeaderCell = ({
  className,
  ...props
}: CalendarHeaderCellProps) => {
  return (
    <AriaCalendarHeaderCell
      className={gridHeaderCell({ className })}
      {...props}
    />
  );
};

interface CalendarGridBodyProps
  extends React.ComponentProps<typeof AriaCalendarGridBody> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
  return (
    <AriaCalendarGridBody className={gridBody({ className })} {...props} />
  );
};

interface CalendarCellProps
  extends React.ComponentProps<typeof AriaCalendarCell> {
  range?: boolean;
}
const CalendarCell = ({ range = false, ...props }: CalendarCellProps) => {
  return (
    <AriaCalendarCell
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cell({ className })
      )}
    />
  );
};

export type {
  CalendarProps,
  CalendarRootProps,
  RangeCalendarProps,
  RangeCalendarRootProps,
  CalendarGridProps,
  CalendarGridHeaderProps,
  CalendarHeaderCellProps,
  CalendarGridBodyProps,
  CalendarCellProps,
};

export {
  Calendar,
  CalendarRoot,
  RangeCalendar,
  RangeCalendarRoot,
  CalendarHeader,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  calendarStyles,
};
