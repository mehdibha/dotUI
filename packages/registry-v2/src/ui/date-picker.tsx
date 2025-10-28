"use client";

import {
  DateRangePicker as AriaDataRangePicker,
  DatePicker as AriaDatePicker,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  DateRangePickerProps as AriaDataRangePickerProps,
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from "react-aria-components";

const datePickerStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

type DatePickerProps<T extends DateValue> =
  | ({
      mode?: "single";
    } & AriaDatePickerProps<T>)
  | ({
      mode: "range";
    } & AriaDataRangePickerProps<T>);

const DatePicker = <T extends DateValue>({
  mode = "single",
  className,
  ...props
}: DatePickerProps<T>) => {
  if (mode === "range") {
    return (
      <AriaDataRangePicker
        className={composeRenderProps(
          className as AriaDataRangePickerProps<T>["className"],
          (className) => datePickerStyles({ className }),
        )}
        {...(props as AriaDataRangePickerProps<T>)}
      />
    );
  }

  return (
    <AriaDatePicker
      className={composeRenderProps(
        className as AriaDatePickerProps<T>["className"],
        (className) => datePickerStyles({ className }),
      )}
      {...(props as AriaDatePickerProps<T>)}
    />
  );
};

export type { DatePickerProps };
export { DatePicker };
