"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Button } from "@/registry/minimalist/ui/button";
import { RangeCalendar } from "@/registry/minimalist/ui/calendar";
import { DateInput, DateSegment } from "@/registry/minimalist/ui/date-input";
import { Dialog } from "@/registry/minimalist/ui/dialog";
import {
  Label,
  HelpText,
  type FieldProps,
} from "@/registry/minimalist/ui/field";
import { InputRoot, type inputStyles } from "@/registry/minimalist/ui/input";

const dateRangePickerStyles = tv({
  base: "flex w-auto flex-col items-start gap-2",
});

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
  ...props
}: DateRangePickerProps<T>) => {
  return (
    <DateRangePickerRoot
      className={className}
      isRequired={isRequired}
      isDisabled={isLoading || isDisabled}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <InputRoot size={size} prefix={prefix} className="pr-1">
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
      <HelpText description={description} errorMessage={errorMessage} />
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
  return (
    <AriaDateRangePicker
      className={dateRangePickerStyles({ className })}
      {...props}
    />
  );
};

export type { DateRangePickerProps, DateRangePickerRootProps };
export { DateRangePicker, DateRangePickerRoot };
