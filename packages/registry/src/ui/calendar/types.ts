import type {
  CalendarProps as AriaCalendarProps,
  RangeCalendarProps as AriaRangeCalendarProps,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarCell as AriaCalendarCell,
  DateValue,
} from "react-aria-components";

export type CalendarProps<T extends DateValue> =
  | ({
      mode?: "single";
    } & AriaCalendarProps<T>)
  | ({
      mode: "range";
    } & AriaRangeCalendarProps<T>);

export interface CalendarHeaderProps extends React.ComponentProps<"header"> {}

export interface CalendarGridProps
  extends React.ComponentProps<typeof AriaCalendarGrid> {}

export interface CalendarGridHeaderProps
  extends React.ComponentProps<typeof AriaCalendarGridHeader> {}

export interface CalendarHeaderCellProps
  extends React.ComponentProps<typeof AriaCalendarHeaderCell> {}

export interface CalendarGridBodyProps
  extends React.ComponentProps<typeof AriaCalendarGridBody> {}

export interface CalendarCellProps
  extends React.ComponentProps<typeof AriaCalendarCell> {
  /**
   * The color variant of the selected cell.
   * @default 'accent'
   */
  variant?: "primary" | "accent";
}

