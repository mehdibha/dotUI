"use client";

import type * as React from "react";
import {
  TimeField as AriaTimeField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue,
} from "react-aria-components";

import { DateInput, DateSegment } from "@dotui/registry/ui/date-input";
import { HelpText, Label } from "@dotui/registry/ui/field";
import { InputRoot } from "@dotui/registry/ui/input";
import type { FieldProps } from "@dotui/registry/ui/field";
import type { InputRootProps } from "@dotui/registry/ui/input";

const timeFieldStyles = tv({
  base: "flex w-32 flex-col items-start gap-2",
});

interface TimeFieldProps<T extends TimeValue>
  extends TimeFieldRootProps<T>,
    Pick<InputRootProps, "size" | "prefix" | "suffix">,
    FieldProps {}

const TimeField = <T extends TimeValue>({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  size,
  ...props
}: TimeFieldProps<T>) => {
  return (
    <TimeFieldRoot {...props}>
      {label && <Label>{label}</Label>}
      <InputRoot size={size} prefix={prefix} suffix={suffix}>
        <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
      </InputRoot>
      <HelpText description={description} errorMessage={errorMessage} />
    </TimeFieldRoot>
  );
};

interface TimeFieldRootProps<T extends TimeValue>
  extends AriaTimeFieldProps<T> {
  ref?: React.RefObject<HTMLDivElement>;
}
const TimeFieldRoot = <T extends TimeValue>({
  className,
  ...props
}: TimeFieldRootProps<T>) => {
  return (
    <AriaTimeField
      className={composeRenderProps(className, (className) =>
        timeFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

interface TimeFieldInputProps extends InputRootProps {}
const TimeFieldInput = (props: TimeFieldInputProps) => {
  return (
    <InputRoot {...props}>
      <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
    </InputRoot>
  );
};

export type { TimeFieldProps, TimeFieldRootProps, TimeFieldInputProps };
export { TimeField, TimeFieldRoot, TimeFieldInput };
