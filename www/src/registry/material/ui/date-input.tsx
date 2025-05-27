"use client";

import React from "react";
import {
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const dateInputStyles = tv({
  slots: {
    input: [
      "text-fg placeholder:text-fg-muted disabled:text-fg-disabled flex flex-1 items-center justify-start disabled:cursor-default",
    ],
    segment:
      "focus:bg-bg-accent focus:text-fg-onAccent type-literal:px-0 placeholder-shown:not-data-disabled:not-data-focused:text-fg-muted disabled:text-fg-disabled outline-hidden select-none rounded px-0.5 focus:caret-transparent",
  },
});

const { input, segment } = dateInputStyles();

interface DateInputProps extends React.ComponentProps<typeof AriaDateInput> {}
const DateInput = ({ className, ...props }: DateInputProps) => {
  return (
    <AriaDateInput
      className={composeRenderProps(className, (className) =>
        input({ className })
      )}
      {...props}
    />
  );
};

interface DateSegmentProps
  extends React.ComponentProps<typeof AriaDateSegment> {}
const DateSegment = ({ className, ...props }: DateSegmentProps) => {
  return (
    <AriaDateSegment
      className={composeRenderProps(className, (className) =>
        segment({ className })
      )}
      {...props}
    />
  );
};

export type { DateInputProps, DateSegmentProps };
export { DateInput, DateSegment };
