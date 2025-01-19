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
  RangeCalendarStateContext as AriaRangeCalendarStateContext,
  composeRenderProps,
  useSlottedContext,
} from "react-aria-components";
import type {
  DateValue,
  CalendarProps as AriaCalendarProps,
  RangeCalendarProps as AriaRangeCalendarProps,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";
import { Button } from "@/registry/core/button-01";
import { Heading } from "@/registry/core/heading";
import { Text } from "@/registry/core/text";
import { focusRing } from "@/registry/lib/focus-styles";

const calendarStyles = tv({
  slots: {
    root: "flex flex-col gap-4",
    header: "flex items-center justify-between gap-2",
    grid: "w-full border-collapse",
    gridHeader: "",
    gridHeaderCell: "text-fg-muted text-xs font-normal",
    gridBody: "",
  },
  variants: {
    standalone: {
      true: {
        root: "bg-bg rounded-md border p-3",
      },
    },
  },
});

const calendarCellStyles = tv({
  slots: {
    cellRoot:
      "outside-month:hidden selection-start:rounded-l-md selection-end:rounded-r-md outline-none",
    cell: [
      focusRing(),
      "hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 hover:unavailable:bg-transparent unavailable:cursor-default unavailable:text-fg-disabled disabled:text-fg-disabled unavailable:not-disabled:line-through my-1 flex size-8 cursor-pointer items-center justify-center rounded-md text-sm transition-colors read-only:cursor-default hover:read-only:bg-transparent disabled:cursor-default disabled:bg-transparent",
    ],
  },
  variants: {
    variant: {
      primary: {},
      accent: {},
    },
    range: {
      true: {
        cellRoot:
          "selected:bg-bg-inverse/10 selected:invalid:bg-bg-danger-muted selected: selected:invalid:text-fg-danger",
        cell: "selection-start:invalid:bg-bg-danger selection-start:invalid:text-fg-onDanger selection-end:invalid:bg-bg-danger selection-end:invalid:text-fg-onDanger",
      },
      false: {
        cell: "selected:invalid:bg-bg-danger selected:invalid:text-fg-onDanger",
      },
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      range: false,
      className: {
        cell: "selected:bg-bg-primary selected:text-fg-onPrimary",
      },
    },
    {
      variant: "accent",
      range: false,
      className: {
        cell: "selected:bg-bg-accent selected:text-fg-onAccent",
      },
    },
    {
      variant: "primary",
      range: true,
      className: {
        cell: "selection-start:bg-bg-primary selection-start:text-fg-onPrimary selection-end:bg-bg-primary selection-end:text-fg-onPrimary",
      },
    },
    {
      variant: "accent",
      range: true,
      className: {
        cell: "selection-start:bg-bg-accent selection-start:text-fg-onAccent selection-end:bg-bg-accent selection-end:text-fg-onAccent",
      },
    },
  ],
  defaultVariants: {
    variant: "accent",
  },
});

const { root, header, grid, gridHeader, gridHeaderCell, gridBody } =
  calendarStyles();

const { cellRoot, cell } = calendarCellStyles();

interface CalendarProps<T extends DateValue>
  extends Omit<CalendarRootProps<T>, "visibleDuration">,
    Omit<VariantProps<typeof calendarCellStyles>, "range"> {
  visibleMonths?: number;
  errorMessage?: string;
}
const Calendar = <T extends DateValue>({
  variant,
  visibleMonths = 1,
  errorMessage,
  ...props
}: CalendarProps<T>) => {
  visibleMonths = Math.min(Math.max(visibleMonths, 1), 3);
  return (
    <CalendarRoot visibleDuration={{ months: visibleMonths }} {...props}>
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
                  {(date) => <CalendarCell variant={variant} date={date} />}
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
  extends Omit<RangeCalendarRootProps<T>, "visibleDuration">,
    Omit<VariantProps<typeof calendarCellStyles>, "range"> {
  visibleMonths?: number;
  errorMessage?: string;
}
const RangeCalendar = <T extends DateValue>({
  variant,
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
                  {(date) => <CalendarCell variant={variant} date={date} />}
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
        root({ standalone, className })
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
  extends React.ComponentProps<typeof AriaCalendarCell>,
    Omit<VariantProps<typeof calendarCellStyles>, "range"> {}
const CalendarCell = ({
  variant = "accent",
  children,
  className,
  ...props
}: CalendarCellProps) => {
  const rangeCalendarState = React.use(AriaRangeCalendarStateContext);
  const range = !!rangeCalendarState;

  return (
    <AriaCalendarCell
      {...props}
      className={composeRenderProps(className, (className) =>
        cellRoot({
          range,
          variant,
          className,
        })
      )}
    >
      {composeRenderProps(
        children,
        (
          _,
          {
            isSelected,
            isFocused,
            isHovered,
            isPressed,
            isUnavailable,
            isDisabled,
            isFocusVisible,
            isInvalid,
            isOutsideMonth,
            isOutsideVisibleRange,
            isSelectionEnd,
            isSelectionStart,
            formattedDate,
          }
        ) => (
          <span
            data-rac=""
            data-focused={isFocused || undefined}
            data-selected={isSelected || undefined}
            data-hovered={isHovered || undefined}
            data-pressed={isPressed || undefined}
            data-unavailable={isUnavailable || undefined}
            data-disabled={isDisabled || undefined}
            data-focus-visible={isFocusVisible || undefined}
            data-invalid={isInvalid || undefined}
            data-outside-month={isOutsideMonth || undefined}
            data-outside-visible-range={isOutsideVisibleRange || undefined}
            data-selection-end={isSelectionEnd || undefined}
            data-selection-start={isSelectionStart || undefined}
            className={cell({
              range,
              variant,
            })}
          >
            {formattedDate}
          </span>
        )
      )}
    </AriaCalendarCell>
  );
};

export type {
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
