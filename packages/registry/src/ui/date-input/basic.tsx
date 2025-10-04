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
      "flex flex-1 items-center justify-start text-fg placeholder:text-fg-muted disabled:cursor-default disabled:text-fg-disabled",
    ],
    segment:
      "rounded px-0.5 outline-hidden select-none placeholder-shown:not-data-disabled:not-data-focused:text-fg-muted focus:bg-accent focus:text-fg-on-accent focus:caret-transparent disabled:text-fg-disabled type-literal:px-0",
  },
});

const { input, segment } = dateInputStyles();

interface DateInputProps extends React.ComponentProps<typeof AriaDateInput> {}
const DateInput = ({ className, ...props }: DateInputProps) => {
  return (
    <AriaDateInput
      className={composeRenderProps(className, (className) =>
        input({ className }),
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
        segment({ className }),
      )}
      {...props}
    />
  );
};

export type { DateInputProps, DateSegmentProps };
export { DateInput, DateSegment };
