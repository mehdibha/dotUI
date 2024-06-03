"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";
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
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { DateFieldInput } from "./date-field";
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

interface DatePickerProps<T extends DateValue> extends DatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DatePicker<T extends DateValue>({
  label,
  labelProps,
  description,
  descriptionProps,
  errorMessage,
  fieldErrorProps,
  prefix,
  suffix,
  loaderPosition = "suffix",
  loading,
  ...props
}: DatePickerProps<T>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const showPrefixLoading = loading && loaderPosition === "prefix";
  const showSuffixLoading = loading && loaderPosition === "suffix";
  return (
    <AriaDatePicker {...props}>
      <Field
        label={label}
        labelProps={labelProps}
        description={description}
        descriptionProps={descriptionProps}
        errorMessage={errorMessage}
        fieldErrorProps={fieldErrorProps}
      >
        <TextFieldInnerWrapper>
          <TextFieldInnerVisual loading={showPrefixLoading}>
            {prefix}
          </TextFieldInnerVisual>
          <DateFieldInput className="flex items-center space-x-0.5">
            {(segment) => (
              <DateSegment
                className={
                  "rounded px-0.5 outline-none focus:bg-border-focus focus:text-black focus:caret-transparent"
                }
                segment={segment}
              />
            )}
          </DateFieldInput>
          <TextFieldInnerVisual loading={showSuffixLoading}>
            <Button shape="square" size="sm" variant="ghost">
              <CalendarIcon />
            </Button>
          </TextFieldInnerVisual>
        </TextFieldInnerWrapper>
      </Field>
      <Overlay type={isMobile ? "drawer" : "popover"}>
        <Dialog>
          <Calendar></Calendar>
        </Dialog>
      </Overlay>
    </AriaDatePicker>
  );
}
