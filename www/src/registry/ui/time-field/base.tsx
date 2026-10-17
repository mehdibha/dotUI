"use client"

import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as TimeFieldPrimitives from "react-aria-components/TimeField"

import { cn } from "@/registry/lib/utils"
import { useStyles as useFieldStyles } from "@/registry/ui/field/styles"

// MARK: timeFieldStyles

// MARK: Separator

interface TimeFieldProps<
  T extends TimeFieldPrimitives.TimeValue,
> extends TimeFieldPrimitives.TimeFieldProps<T> {}

const TimeField = <T extends TimeFieldPrimitives.TimeValue>({
  className,
  ...props
}: TimeFieldProps<T>) => {
  const { field } = useFieldStyles()()
  return (
    <TimeFieldPrimitives.TimeField
      data-time-field=""
      data-field=""
      className={composeRenderProps(className, (className) =>
        field({ className: cn("group/time-field", className) }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type { TimeFieldProps }
export { TimeField }
