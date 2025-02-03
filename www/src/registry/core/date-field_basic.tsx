"use client";

import * as React from "react";
import {
  DateField as AriaDateField,
  composeRenderProps,
  type DateValue,
  type DateFieldProps as AriaDateFieldProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { DateInput, DateSegment } from "@/registry/core/date-input_basic";
import { HelpText, Label, type FieldProps } from "./field_basic";
import { InputRoot, type InputRootProps } from "./input_basic";

const dateFieldStyles = tv({
  base: "flex w-32 flex-col items-start gap-2",
});

interface DateFieldProps<T extends DateValue>
  extends DateFieldRootProps<T>,
    Pick<InputRootProps, "size" | "prefix" | "suffix">,
    FieldProps {}

const DateField = <T extends DateValue>({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  size,
  ...props
}: DateFieldProps<T>) => {
  return (
    <DateFieldRoot {...props}>
      {label && <Label>{label}</Label>}
      <DateFieldInput prefix={prefix} suffix={suffix} size={size} />
      <HelpText description={description} errorMessage={errorMessage} />
    </DateFieldRoot>
  );
};

interface DateFieldRootProps<T extends DateValue>
  extends AriaDateFieldProps<T> {
  ref?: React.RefObject<HTMLDivElement>;
}
const DateFieldRoot = <T extends DateValue>({
  className,
  ...props
}: DateFieldRootProps<T>) => {
  return (
    <AriaDateField
      className={composeRenderProps(className, (className) =>
        dateFieldStyles({ className })
      )}
      {...props}
    />
  );
};

interface DateFieldInputProps extends InputRootProps {}
const DateFieldInput = (props: DateFieldInputProps) => {
  return (
    <InputRoot {...props}>
      <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
    </InputRoot>
  );
};

export type { DateFieldProps, DateFieldRootProps, DateFieldInputProps };
export { DateField, DateFieldRoot, DateFieldInput };
