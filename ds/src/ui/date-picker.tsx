'use client'

import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as DatePickerPrimitive from 'react-aria-components/DatePicker'
import * as DateRangePickerPrimitive from 'react-aria-components/DateRangePicker'

import { fieldVariants } from '@/ui/field'

interface DatePickerProps<
  T extends DatePickerPrimitive.DateValue,
> extends DatePickerPrimitive.DatePickerProps<T> {}

const DatePicker = <T extends DatePickerPrimitive.DateValue>({
  className,
  ...props
}: DatePickerProps<T>) => {
  const fieldStyles = fieldVariants
  return (
    <DatePickerPrimitive.DatePicker
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  )
}

interface DateRangePickerProps<
  T extends DateRangePickerPrimitive.DateValue,
> extends DateRangePickerPrimitive.DateRangePickerProps<T> {}

const DateRangePicker = <T extends DateRangePickerPrimitive.DateValue>({
  className,
  ...props
}: DateRangePickerProps<T>) => {
  const fieldStyles = fieldVariants
  return (
    <DateRangePickerPrimitive.DateRangePicker
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  )
}

export type { DatePickerProps, DateRangePickerProps }
export { DatePicker, DateRangePicker }
