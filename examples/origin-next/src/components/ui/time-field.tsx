"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TimeFieldPrimitives from "react-aria-components/TimeField";

import { cn } from "@/lib/utils";
import { fieldStyles } from "@/components/ui/field";

/* -------------------------------------------------------------------------- */

interface TimeFieldProps<
  T extends TimeFieldPrimitives.TimeValue,
> extends TimeFieldPrimitives.TimeFieldProps<T> {}

const TimeField = <T extends TimeFieldPrimitives.TimeValue>({
  className,
  ...props
}: TimeFieldProps<T>) => {
  const { field } = fieldStyles();
  return (
    <TimeFieldPrimitives.TimeField
      data-time-field=""
      data-field=""
      className={composeRenderProps(className, (className) =>
        field({ className: cn("group/time-field", className) }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { TimeFieldProps };
export { TimeField };
