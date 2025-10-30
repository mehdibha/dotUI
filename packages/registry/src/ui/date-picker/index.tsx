"use client";

import type { DateValue } from "react-aria";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  DatePickerContentProps,
  DatePickerInputProps,
  DatePickerProps,
} from "./basic";
import {
  DatePicker as _DatePicker,
  DatePickerContent as _DatePickerContent,
  DatePickerInput as _DatePickerInput,
} from "./basic";

export const DatePicker = <T extends DateValue>(props: DatePickerProps<T>) => {
  const Component = createDynamicComponent<DatePickerProps<T>>(
    "date-picker",
    "DatePicker",
    _DatePicker,
    {},
  );

  return <Component {...props} />;
};

export const DatePickerContent = createDynamicComponent<DatePickerContentProps>(
  "date-picker",
  "DatePickerContent",
  _DatePickerContent,
  {},
);

export const DatePickerInput = createDynamicComponent<DatePickerInputProps>(
  "date-picker",
  "DatePickerInput",
  _DatePickerInput,
  {},
);

export type { DatePickerProps, DatePickerContentProps, DatePickerInputProps };
