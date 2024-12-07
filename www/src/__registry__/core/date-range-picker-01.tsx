"use client";

import * as React from "react";
import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { Button } from "@/registry/core/button-01";
import { DateInput, DateSegment } from "@/registry/core/date-input-01";
import { Dialog } from "@/registry/core/dialog-01";
import { Field, type FieldProps, fieldStyles } from "@/registry/core/field-01";
import { InputRoot, type inputStyles } from "@/registry/core/input-01";
import { RangeCalendar } from "@/registry/core/range-calendar-01";
import { CalendarIcon } from "@/__registry__/icons";

interface DateRangePickerProps<T extends DateValue>
  extends DateRangePickerRootProps<T>,
    Omit<FieldProps, "children">,
    VariantProps<typeof inputStyles> {
  prefix?: React.ReactNode;
  isLoading?: boolean;
}

const DateRangePicker = <T extends DateValue>({
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
}: DateRangePickerProps<T>) => {
  return (
    <DateRangePickerRoot
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
          <DateInput slot="start">
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <span aria-hidden="true">–</span>
          <DateInput slot="end" className="flex-1">
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
        <RangeCalendar className="mx-auto" />
      </Dialog>
    </DateRangePickerRoot>
  );
};

interface DateRangePickerRootProps<T extends DateValue>
  extends Omit<AriaDateRangePickerProps<T>, "className"> {
  className?: string;
}
const DateRangePickerRoot = <T extends DateValue>({
  className,
  ...props
}: DateRangePickerRootProps<T>) => {
  const { root } = fieldStyles();
  return <AriaDateRangePicker className={root({ className })} {...props} />;
};

export type { DateRangePickerProps, DateRangePickerRootProps };
export { DateRangePicker, DateRangePickerRoot };
