"use client"

import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as DateFieldPrimitives from "react-aria-components/DateField"

import { cn } from "@/registry/lib/utils"
import { useStyles } from "@/registry/ui/field/styles"

// MARK: dateFieldStyles

// MARK: Separator

interface DateFieldProps<
  T extends DateFieldPrimitives.DateValue,
> extends DateFieldPrimitives.DateFieldProps<T> {}

const DateField = <T extends DateFieldPrimitives.DateValue>({
  className,
  ...props
}: DateFieldProps<T>) => {
  const fieldStyles = useStyles()
  return (
    <DateFieldPrimitives.DateField
      data-date-field=""
      data-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className: cn("group/date-field", className) }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type { DateFieldProps }
export { DateField }
