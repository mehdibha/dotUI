"use client";

import * as React from "react";
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { Button } from "@/registry/ui/default/core/button";
import { Calendar } from "@/registry/ui/default/core/calendar";
import { DateInput, DateSegment } from "@/registry/ui/default/core/date-input";
import { Dialog } from "@/registry/ui/default/core/dialog";
import {
  Field,
  fieldStyles,
  type FieldProps,
} from "@/registry/ui/default/core/field";
import { InputRoot, type inputStyles } from "@/registry/ui/default/core/input";
import { CalendarIcon } from "@/__icons__";

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
  necessityIndicator,
  contextualHelp,
  ...props
}: DatePickerProps<T>) => {
  return (
    <DatePickerRoot
      className={className}
      isRequired={isRequired}
      isDisabled={isLoading || isDisabled}
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
          loaderPosition="prefix"
          className="pr-1"
        >
          <DateInput>
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
