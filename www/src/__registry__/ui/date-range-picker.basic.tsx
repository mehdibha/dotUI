"use client";

import type { FieldProps } from "@/components/dynamic-ui/field";
import type { inputStyles } from "@/components/dynamic-ui/input";
import type {
  DateRangePickerProps as AriaDateRangePickerProps,
  DateValue,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { RangeCalendar } from "@/components/dynamic-ui/calendar";
import { DateInput, DateSegment } from "@/components/dynamic-ui/date-input";
import { Dialog } from "@/components/dynamic-ui/dialog";
import { HelpText, Label } from "@/components/dynamic-ui/field";
import { InputRoot } from "@/components/dynamic-ui/input";
import { CalendarIcon } from "lucide-react";
import { DateRangePicker as AriaDateRangePicker } from "react-aria-components";
import { tv } from "tailwind-variants";

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
