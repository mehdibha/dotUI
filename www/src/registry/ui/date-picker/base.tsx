"use client"

import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as DatePickerPrimitives from "react-aria-components/DatePicker"
import * as DateRangePickerPrimitives from "react-aria-components/DateRangePicker"

import { useStyles } from "@/registry/ui/field/styles"

// MARK: Separator

interface DatePickerProps<
  T extends DatePickerPrimitives.DateValue,
> extends DatePickerPrimitives.DatePickerProps<T> {}

const DatePicker = <T extends DatePickerPrimitives.DateValue>({
  className,
  ...props
}: DatePickerProps<T>) => {
  const fieldStyles = useStyles()
  return (
    <DatePickerPrimitives.DatePicker
      data-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface DateRangePickerProps<
  T extends DateRangePickerPrimitives.DateValue,
> extends DateRangePickerPrimitives.DateRangePickerProps<T> {}

const DateRangePicker = <T extends DateRangePickerPrimitives.DateValue>({
  className,
  ...props
}: DateRangePickerProps<T>) => {
  const fieldStyles = useStyles()
  return (
    <DateRangePickerPrimitives.DateRangePicker
      data-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type { DatePickerProps, DateRangePickerProps }
export { DatePicker, DateRangePicker }
