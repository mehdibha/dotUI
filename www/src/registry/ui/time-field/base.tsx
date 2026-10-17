"use client"

import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as TimeFieldPrimitives from "react-aria-components/TimeField"

import { cn } from "@/registry/lib/utils"
import { useStyles } from "@/registry/ui/field/styles"

// MARK: timeFieldStyles

// MARK: TimeField

interface TimeFieldProps<
  T extends TimeFieldPrimitives.TimeValue,
> extends TimeFieldPrimitives.TimeFieldProps<T> {}

const TimeField = <T extends TimeFieldPrimitives.TimeValue>({
  className,
  ...props
}: TimeFieldProps<T>) => {
  const fieldStyles = useStyles()
  return (
    <TimeFieldPrimitives.TimeField
      data-time-field=""
      data-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className: cn("group/time-field", className) }),
      )}
      {...props}
    />
  )
}

// MARK: exports

export type { TimeFieldProps }
export { TimeField }
