"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DatePickerPrimitives from "react-aria-components/DatePicker";
import * as DateRangePickerPrimitives from "react-aria-components/DateRangePicker";

import { fieldStyles } from "@/components/ui/field";

/* -------------------------------------------------------------------------- */

interface DatePickerProps<
  T extends DatePickerPrimitives.DateValue,
> extends DatePickerPrimitives.DatePickerProps<T> {}

const DatePicker = <T extends DatePickerPrimitives.DateValue>({
  className,
  ...props
}: DatePickerProps<T>) => {
  const { field } = fieldStyles();
  return (
    <DatePickerPrimitives.DatePicker
      data-field=""
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface DateRangePickerProps<
  T extends DateRangePickerPrimitives.DateValue,
> extends DateRangePickerPrimitives.DateRangePickerProps<T> {}

const DateRangePicker = <T extends DateRangePickerPrimitives.DateValue>({
  className,
  ...props
}: DateRangePickerProps<T>) => {
  const { field } = fieldStyles();
  return (
    <DateRangePickerPrimitives.DateRangePicker
      data-field=""
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { DatePickerProps, DateRangePickerProps };
export { DatePicker, DateRangePicker };
