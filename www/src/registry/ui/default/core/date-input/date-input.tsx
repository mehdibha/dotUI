"use client";

import React from "react";
import {
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  type DateSegmentProps as AriaDateSegmentProps,
  type DateInputProps as AriaDateInputProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const dateInputStyles = tv({
  slots: {
    input: [
      "text-fg placeholder:text-fg-muted disabled:text-fg-disabled flex items-center justify-start disabled:cursor-default",
    ],
    segment:
      "focus:bg-bg-accent focus:text-fg-onAccent type-literal:px-0 placeholder-shown:[&:not([data-disabled])]:[&:not([data-focused])]:text-fg-muted disabled:text-fg-disabled select-none rounded px-0.5 outline-none focus:caret-transparent",
  },
});

interface DateInputProps extends Omit<AriaDateInputProps, "className"> {
  className?: string;
}
const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => {
    const { input } = dateInputStyles();
    return (
      <AriaDateInput ref={ref} className={input({ className })} {...props} />
    );
  }
);
DateInput.displayName = "Input";

interface DateSegmentProps extends Omit<AriaDateSegmentProps, "className"> {
  className?: string;
}
const DateSegment = React.forwardRef<HTMLInputElement, DateSegmentProps>(
  ({ className, ...props }, ref) => {
    const { segment } = dateInputStyles();
    return (
      <AriaDateSegment
        ref={ref}
        className={segment({ className })}
        {...props}
      />
    );
  }
);
DateSegment.displayName = "Segment";

export type { DateInputProps, DateSegmentProps };
export { DateInput, DateSegment };
