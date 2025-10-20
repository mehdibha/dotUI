"use client";

import {
  DatePicker as AriaDatePicker,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from "react-aria-components";

const datePickerStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {}
const DatePicker = <T extends DateValue>({
  className,
  ...props
}: DatePickerProps<T>) => {
  return (
    <AriaDatePicker
      className={composeRenderProps(className, (className) =>
        datePickerStyles({ className }),
      )}
      {...props}
    />
  );
};

export type { DatePickerProps };
export { DatePicker };
