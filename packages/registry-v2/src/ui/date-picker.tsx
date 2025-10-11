"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DatePicker as AriaDatePicker } from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { Button } from "@dotui/registry-v2/ui/button";
import { Calendar } from "@dotui/registry-v2/ui/calendar";
import { DateInput, DateSegment } from "@dotui/registry-v2/ui/date-input";
import { Dialog } from "@dotui/registry-v2/ui/dialog";
import { HelpText, Label } from "@dotui/registry-v2/ui/field";
import { InputRoot } from "@dotui/registry-v2/ui/input";
import type { FieldProps } from "@dotui/registry-v2/ui/field";
import type { inputStyles } from "@dotui/registry-v2/ui/input";

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
      <Dialog.Overlay type="popover" mobileType="drawer">
        <Dialog.Content>
          <Calendar className="mx-auto" />
        </Dialog.Content>
      </Dialog.Overlay>
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
