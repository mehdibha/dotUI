"use client"

import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as DateFieldPrimitives from "react-aria-components/DateField"

import { useStyles as useFieldStyles } from "@/registry/ui/field/styles"

// MARK: dateFieldStyles

// MARK: Separator

interface DateFieldProps<
  T extends DateFieldPrimitives.DateValue,
> extends DateFieldPrimitives.DateFieldProps<T> {}

const DateField = <T extends DateFieldPrimitives.DateValue>({
  className,
  ...props
}: DateFieldProps<T>) => {
  const { field } = useFieldStyles()()
  return (
    <DateFieldPrimitives.DateField
      data-date-field=""
      data-field=""
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type { DateFieldProps }
export { DateField }
