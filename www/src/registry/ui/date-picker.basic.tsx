"use client";

import type { FieldProps } from "@/registry/ui/field.basic";
import type { inputStyles } from "@/registry/ui/input.basic";
import type {
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { Button } from "@/registry/ui/button.basic";
import { Calendar } from "@/registry/ui/calendar.basic";
import { DateInput, DateSegment } from "@/registry/ui/date-input.basic";
import { Dialog } from "@/registry/ui/dialog.basic";
import { HelpText, Label } from "@/registry/ui/field.basic";
import { InputRoot } from "@/registry/ui/input.basic";
import { CalendarIcon } from "lucide-react";
import { DatePicker as AriaDatePicker } from "react-aria-components";
import { tv } from "tailwind-variants";

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
