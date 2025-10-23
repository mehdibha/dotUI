"use client";

import {
  DateRangePicker as AriaDateRangePicker,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  DateRangePickerProps as AriaDateRangePickerProps,
  DateValue,
} from "react-aria-components";

import { fieldStyles } from "@dotui/registry-v2/ui/field";

const dateRangePickerStyles = tv({
  extend: fieldStyles().field(),
  base: "flex w-auto flex-col items-start gap-2",
});

/* -----------------------------------------------------------------------------------------------*/

interface DateRangePickerProps<T extends DateValue>
  extends AriaDateRangePickerProps<T> {}

const DateRangePicker = <T extends DateValue>({
  className,
  ...props
}: DateRangePickerProps<T>) => {
  return (
    <AriaDateRangePicker
      className={composeRenderProps(className, (cn) =>
        dateRangePickerStyles({ className: cn }),
      )}
      {...props}
    />
  );
};

export type { DateRangePickerProps };
export { DateRangePicker };
