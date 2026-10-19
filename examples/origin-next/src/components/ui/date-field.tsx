"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DateFieldPrimitive from "react-aria-components/DateField";

import { fieldStyles } from "@/components/ui/field";

/* -------------------------------------------------------------------------- */

interface DateFieldProps<
  T extends DateFieldPrimitive.DateValue,
> extends DateFieldPrimitive.DateFieldProps<T> {}

const DateField = <T extends DateFieldPrimitive.DateValue>({
  className,
  ...props
}: DateFieldProps<T>) => {
  return (
    <DateFieldPrimitive.DateField
      data-date-field=""
      data-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { DateFieldProps };
export { DateField };
