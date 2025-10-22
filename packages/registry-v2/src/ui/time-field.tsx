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
import { fieldStyles } from "./field";

const timeFieldStyles = tv({
  extend: fieldStyles().field(),
  base: "",
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
