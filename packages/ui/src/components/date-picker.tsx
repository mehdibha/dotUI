"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  DatePicker as _DatePicker,
  DatePickerRoot as _DatePickerRoot,
} from "../registry/components/date-picker/basic";
import type {
  DatePickerProps,
  DatePickerRootProps,
} from "../registry/components/date-picker/basic";

export const DatePicker = createDynamicComponent<DatePickerProps<any>>(
  "date-picker",
  "DatePicker",
  _DatePicker,
  {},
);

export const DatePickerRoot = createDynamicComponent<DatePickerRootProps<any>>(
  "date-picker",
  "DatePickerRoot",
  _DatePickerRoot,
  {},
);

export type { DatePickerProps, DatePickerRootProps };
