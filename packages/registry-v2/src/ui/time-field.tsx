"use client";

import {
  TimeField as AriaTimeField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue,
} from "react-aria-components";

const timeFieldStyles = tv({
  base: "flex w-32 flex-col items-start gap-2",
});

/* -----------------------------------------------------------------------------------------------*/

interface TimeFieldProps<T extends TimeValue> extends AriaTimeFieldProps<T> {}

const TimeField = <T extends TimeValue>({
  className,
  ...props
}: TimeFieldProps<T>) => {
  return (
    <AriaTimeField
      className={composeRenderProps(className, (className) =>
        timeFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export type { TimeFieldProps };
export { TimeField };
