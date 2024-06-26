"use client";

import * as React from "react";
import {
  DateRangePicker as AriaDateRangePicker,
  Dialog as AriaDialog,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { CalendarIcon } from "@/lib/icons";
import { Button } from "./button";
import { DateInput, DateSegment } from "./date-input";
import { fieldStyles } from "./field";
import { Field, type FieldProps } from "./field";
import { InputRoot, type inputStyles } from "./input";
import { Overlay } from "./overlay";
import { RangeCalendar } from "./range-calendar";

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
        <InputRoot size={size} prefix={prefix} isLoading={isLoading} loaderPosition="prefix">
          <DateInput slot="start">{(segment) => <DateSegment segment={segment} />}</DateInput>
          <span aria-hidden="true">–</span>
          <DateInput slot="end">{(segment) => <DateSegment segment={segment} />}</DateInput>
          <Button size="sm" shape="square" className="h-full rounded-none">
            <CalendarIcon />
          </Button>
        </InputRoot>
      </Field>
      <Overlay type="popover">
        <AriaDialog className="outline-none">
          <RangeCalendar className="mx-auto border-none" />
        </AriaDialog>
      </Overlay>
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
