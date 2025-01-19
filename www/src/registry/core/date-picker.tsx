"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { Button } from "@/registry/core/button-01";
import { Calendar } from "@/registry/core/calendar_basic";
import { DateInput, DateSegment } from "@/registry/core/date-input";
import { Dialog } from "@/registry/core/dialog";
import { Field, fieldStyles, type FieldProps } from "@/registry/core/field";
import { InputRoot, type inputStyles } from "@/registry/core/input";

interface DatePickerProps<T extends DateValue>
  extends DatePickerRootProps<T>,
    Omit<FieldProps, "children">,
    VariantProps<typeof inputStyles> {
  prefix?: React.ReactNode;
  isLoading?: boolean;
}

const DatePicker = <T extends DateValue>({
  className,
  size,
  label,
  description,
  errorMessage,
  prefix,
  isLoading,
  isRequired,
  isDisabled,
  isInvalid,
  necessityIndicator,
  contextualHelp,
  ...props
}: DatePickerProps<T>) => {
  return (
    <DatePickerRoot
      className={className}
      isRequired={isRequired}
      isDisabled={isLoading || isDisabled}
      isInvalid={isInvalid}
      {...props}
    >
      <Field
        label={label}
        description={description}
        errorMessage={errorMessage}
        isRequired={isRequired}
        necessityIndicator={necessityIndicator}
        contextualHelp={contextualHelp}
      >
        <InputRoot
          size={size}
          prefix={prefix}
          isLoading={isLoading}
          isInvalid={isInvalid}
          loaderPosition="prefix"
          className="pr-1"
        >
          <DateInput className="flex-1">
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <Button
            variant="default"
            size="sm"
            shape="square"
            className="my-1 size-7 rounded-sm"
          >
            <CalendarIcon />
          </Button>
        </InputRoot>
      </Field>
      <Dialog type="popover" mobileType="drawer" className="flex">
        <Calendar className="mx-auto" />
      </Dialog>
    </DatePickerRoot>
  );
};

interface DatePickerRootProps<T extends DateValue>
  extends Omit<AriaDatePickerProps<T>, "className"> {
  className?: string;
}
const DatePickerRoot = <T extends DateValue>({
  className,
  ...props
}: DatePickerRootProps<T>) => {
  const { root } = fieldStyles();
  return <AriaDatePicker className={root({ className })} {...props} />;
};

export type { DatePickerProps, DatePickerRootProps };
export { DatePicker, DatePickerRoot };
