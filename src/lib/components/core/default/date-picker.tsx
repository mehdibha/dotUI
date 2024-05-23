"use client";

import React from "react";
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  DateInput,
  DateValue,
  Dialog,
  Group,
  ValidationResult,
} from "react-aria-components";
import { DateSegment } from "react-aria-components";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Field } from "./field";
import { Overlay } from "./overlay";
import { PopoverRootProps } from "./popover";
import {
  TextFieldContext,
  TextFieldInnerVisual,
  TextFieldInnerWrapper,
  textFieldVariants,
  useTextFieldContext,
} from "./text-field";

interface MyDatePickerProps<T extends DateValue> extends DatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: MyDatePickerProps<T>) {
  return (
    <AriaDatePicker {...props}>
      {/* <Field
        label={label}
        labelProps={labelProps}
        description={description}
        descriptionProps={descriptionProps}
        errorMessage={errorMessage}
        fieldErrorProps={fieldErrorProps}
      >
        <DateFieldInnerWrapper>
          <DateFieldInnerVisual loading={showPrefixLoading}>
            {prefix}
          </DateFieldInnerVisual>
          <DateFieldInput className="flex items-center space-x-0.5">
            {(segment) => (
              <DateSegment
                className={
                  "px-0.5 focus:text-black focus:caret-transparent outline-none focus:bg-border-focus rounded"
                }
                segment={segment}
              />
            )}
          </DateFieldInput>
          <DateFieldInnerVisual loading={showSuffixLoading}>
            {suffix}
          </DateFieldInnerVisual>
        </DateFieldInnerWrapper>
      </Field> */}
      <Group>
        <DateInput>
          {(segment) => (
            <DateSegment
              className={
                "rounded px-0.5 outline-none focus:bg-border-focus focus:text-black focus:caret-transparent"
              }
              segment={segment}
            />
          )}
        </DateInput>
        <Button>click</Button>
      </Group>
      <Overlay type="popover">
        <Dialog>
          <Calendar></Calendar>
        </Dialog>
      </Overlay>
    </AriaDatePicker>
  );
}



interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {}
const DatePickerRoot = <T extends DateValue>(props: DatePickerProps<T>) => {
  return <AriaDatePicker {...props} />;
};
DatePickerRoot.displayName = "DatePickerRoot";

const DatePickerPopover = React.forwardRef<
  React.ElementRef<typeof Overlay>,
  PopoverRootProps
>((props, ref) => {
  return <Overlay ref={ref} {...props} />;
});
DatePickerPopover.displayName = "DatePickerPopover";

const DatePickerDialog = Dialog;

const DatePickerCalendar = Calendar;
