"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DateFieldPrimitives from "react-aria-components/DateField";

import { fieldStyles } from "@/components/ui/field";

/* -------------------------------------------------------------------------- */

interface DateFieldProps<
  T extends DateFieldPrimitives.DateValue,
> extends DateFieldPrimitives.DateFieldProps<T> {}

const DateField = <T extends DateFieldPrimitives.DateValue>({
  className,
  ...props
}: DateFieldProps<T>) => {
  const { field } = fieldStyles();
  return (
    <DateFieldPrimitives.DateField
      data-date-field=""
      data-field=""
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { DateFieldProps };
export { DateField };
