"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Button } from "@/registry/core/button_basic";
import { Calendar } from "@/registry/core/calendar_basic";
import { DateInput, DateSegment } from "@/registry/core/date-input_basic";
import { Dialog } from "@/registry/core/dialog_basic";
import { Label, HelpText, type FieldProps } from "@/registry/core/field_basic";
import { InputRoot, type inputStyles } from "@/registry/core/input_basic";

const datePickerStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

interface DatePickerProps<T extends DateValue>
  extends DatePickerRootProps<T>,
    Omit<FieldProps, "children">,
    VariantProps<typeof inputStyles> {
  prefix?: React.ReactNode;
}

const DatePicker = <T extends DateValue>({
  size,
  label,
  description,
  errorMessage,
  prefix,
  ...props
}: DatePickerProps<T>) => {
  return (
    <DatePickerRoot {...props}>
      {label && <Label>{label}</Label>}
      <InputRoot
        size={size}
        prefix={prefix}
        // isInvalid={isInvalid}
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
      <HelpText description={description} errorMessage={errorMessage} />
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
  return (
    <AriaDatePicker className={datePickerStyles({ className })} {...props} />
  );
};

export type { DatePickerProps, DatePickerRootProps };
export { DatePicker, DatePickerRoot };
