"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DatePickerPrimitive from "react-aria-components/DatePicker";
import * as DateRangePickerPrimitive from "react-aria-components/DateRangePicker";

import { fieldStyles } from "@/components/ui/field";

/* -------------------------------------------------------------------------- */

interface DatePickerProps<
  T extends DatePickerPrimitive.DateValue,
> extends DatePickerPrimitive.DatePickerProps<T> {}

const DatePicker = <T extends DatePickerPrimitive.DateValue>({
  className,
  ...props
}: DatePickerProps<T>) => {
  return (
    <DatePickerPrimitive.DatePicker
      data-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface DateRangePickerProps<
  T extends DateRangePickerPrimitive.DateValue,
> extends DateRangePickerPrimitive.DateRangePickerProps<T> {}

const DateRangePicker = <T extends DateRangePickerPrimitive.DateValue>({
  className,
  ...props
}: DateRangePickerProps<T>) => {
  return (
    <DateRangePickerPrimitive.DateRangePicker
      data-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { DatePickerProps, DateRangePickerProps };
export { DatePicker, DateRangePicker };
