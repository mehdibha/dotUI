"use client";

import {
  DateField as AriaDateField,
  composeRenderProps,
} from "react-aria-components";
import type {
  DateFieldProps as AriaDateFieldProps,
  DateValue,
} from "react-aria-components";

import { fieldStyles } from "@dotui/registry-v2/ui/field";

/* -----------------------------------------------------------------------------------------------*/

interface DateFieldProps<T extends DateValue> extends AriaDateFieldProps<T> {}

const DateField = <T extends DateValue>({
  className,
  ...props
}: DateFieldProps<T>) => {
  return (
    <AriaDateField
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  );
};

export type { DateFieldProps };
export { DateField };
