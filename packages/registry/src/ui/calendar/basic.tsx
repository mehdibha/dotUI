"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarContext as AriaCalendarContext,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  Heading as AriaHeading,
  RangeCalendar as AriaRangeCalendar,
  RangeCalendarContext as AriaRangeCalendarContext,
  RangeCalendarStateContext as AriaRangeCalendarStateContext,
  composeRenderProps,
  useSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  CalendarProps as AriaCalendarProps,
  RangeCalendarProps as AriaRangeCalendarProps,
  DateValue,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { Button } from "@dotui/registry/ui/button";

const calendarStyles = tv({
  slots: {
    root: "flex flex-col gap-4",
    header: "flex items-center justify-between gap-2",
    grid: "w-full border-collapse",
    gridHeader: "",
    gridHeaderCell: "text-xs font-normal text-fg-muted",
    gridBody: "",
  },
  variants: {
    standalone: {
      true: {
        root: "rounded-md border bg-bg p-3",
      },
    },
  },
});

const calendarCellStyles = tv({
  slots: {
    cellRoot:
      "flex items-center justify-center outline-none outside-month:hidden selection-start:rounded-l-md selection-end:rounded-r-md",
    cell: [
      "focus-reset focus-visible:focus-ring",
      "my-1 flex size-8 cursor-pointer items-center justify-center rounded-md text-sm transition-colors read-only:cursor-default hover:bg-inverse/10 hover:read-only:bg-transparent disabled:cursor-default disabled:bg-transparent disabled:text-fg-disabled unavailable:cursor-default unavailable:text-fg-disabled unavailable:not-data-disabled:line-through hover:unavailable:bg-transparent pressed:bg-inverse/20",
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
          "selected: selected:bg-inverse/10 selected:invalid:bg-danger-muted selected:invalid:text-fg-danger",
        cell: "selection-start:invalid:bg-danger selection-start:invalid:text-fg-on-danger selection-end:invalid:bg-danger selection-end:invalid:text-fg-on-danger",
      },
      false: {
        cell: "selected:invalid:bg-danger selected:invalid:text-fg-on-danger",
      },
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      range: false,
      className: {
        cell: "selected:bg-primary selected:text-fg-on-primary",
      },
    },
    {
      variant: "accent",
      range: false,
      className: {
        cell: "selected:bg-accent selected:text-fg-on-accent",
      },
    },
    {
      variant: "primary",
      range: true,
      className: {
        cell: "selection-start:bg-primary selection-start:text-fg-on-primary selection-end:bg-primary selection-end:text-fg-on-primary",
      },
    },
    {
      variant: "accent",
      range: true,
      className: {
        cell: "selection-start:bg-accent selection-start:text-fg-on-accent selection-end:bg-accent selection-end:text-fg-on-accent",
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

/* -----------------------------------------------------------------------------------------------*/

type CalendarProps<T extends DateValue> =
  | ({
      mode?: "single";
    } & AriaCalendarProps<T>)
  | ({
      mode: "range";
    } & AriaRangeCalendarProps<T>);

const Calendar = <T extends DateValue>({
  mode = "single",
  className,
  ...props
}: CalendarProps<T>) => {
  const rangeCalendarContext = useSlottedContext(AriaRangeCalendarContext);
  const calendarContext = useSlottedContext(AriaCalendarContext);

  if (mode === "range") {
    const standalone = Object.keys(rangeCalendarContext ?? {}).length === 0;
    return (
      <AriaRangeCalendar
        className={composeRenderProps(
          className as AriaRangeCalendarProps<T>["className"],
          (className) => root({ standalone, className }),
        )}
        {...(props as AriaRangeCalendarProps<T>)}
      >
        {composeRenderProps(
          props.children as AriaRangeCalendarProps<T>["children"],
          (children) =>
            children ?? (
              <>
                <CalendarHeader />
                <CalendarGrid />
              </>
            ),
        )}
      </AriaRangeCalendar>
    );
  }

  const standalone = !!calendarContext;
  return (
    <AriaCalendar
      className={composeRenderProps(
        className as AriaCalendarProps<T>["className"],
        (className) => root({ standalone, className }),
      )}
      {...(props as AriaCalendarProps<T>)}
    >
      {composeRenderProps(
        props.children as AriaCalendarProps<T>["children"],
        (children) =>
          children ?? (
            <>
              <CalendarHeader />
              <CalendarGrid />
            </>
          ),
      )}
    </AriaCalendar>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CalendarHeaderProps extends React.ComponentProps<"header"> {}

const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
  return (
    <header className={header({ className })} {...props}>
      {props.children ?? (
        <>
          <Button slot="previous" variant="default" size="sm">
            <ChevronLeftIcon />
          </Button>
          <AriaHeading className="text-sm font-medium" />
          <Button slot="next" variant="default" size="sm">
            <ChevronRightIcon />
          </Button>
        </>
      )}
    </header>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CalendarGridProps
  extends React.ComponentProps<typeof AriaCalendarGrid> {}

const CalendarGrid = ({ className, ...props }: CalendarGridProps) => {
  return (
    <AriaCalendarGrid className={grid({ className })} {...props}>
      {props.children ?? (
        <>
          <CalendarGridHeader>
            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </>
      )}
    </AriaCalendarGrid>
  );
};

/* -----------------------------------------------------------------------------------------------*/

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

/* -----------------------------------------------------------------------------------------------*/

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

/* -----------------------------------------------------------------------------------------------*/

interface CalendarGridBodyProps
  extends React.ComponentProps<typeof AriaCalendarGridBody> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
  return (
    <AriaCalendarGridBody className={gridBody({ className })} {...props} />
  );
};

/* -----------------------------------------------------------------------------------------------*/

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
        }),
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
          },
        ) => (
          <span
            data-slot="calendar-cell"
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
        ),
      )}
    </AriaCalendarCell>
  );
};


export {
  Calendar,
  CalendarHeader,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  calendarStyles,
};

export type {
  CalendarProps,
  CalendarHeaderProps,
  CalendarGridProps,
  CalendarGridHeaderProps,
  CalendarHeaderCellProps,
  CalendarGridBodyProps,
  CalendarCellProps,
};