"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TimeFieldPrimitive from "react-aria-components/TimeField";

import { cn } from "@/lib/utils";
import { fieldStyles } from "@/components/ui/field";

/* -------------------------------------------------------------------------- */

interface TimeFieldProps<
  T extends TimeFieldPrimitive.TimeValue,
> extends TimeFieldPrimitive.TimeFieldProps<T> {}

const TimeField = <T extends TimeFieldPrimitive.TimeValue>({
  className,
  ...props
}: TimeFieldProps<T>) => {
  return (
    <TimeFieldPrimitive.TimeField
      data-time-field=""
      data-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className: cn("group/time-field", className) }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { TimeFieldProps };
export { TimeField };
