"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  DateField as _DateField,
  DateFieldInput as _DateFieldInput,
  DateFieldRoot as _DateFieldRoot,
} from "./basic";
import type {
  DateFieldInputProps,
  DateFieldProps,
  DateFieldRootProps,
} from "./basic";

export const DateField = createDynamicComponent<DateFieldProps<any>>(
  "date-field",
  "DateField",
  _DateField,
  {},
);

export const DateFieldRoot = createDynamicComponent<DateFieldRootProps<any>>(
  "date-field",
  "DateFieldRoot",
  _DateFieldRoot,
  {},
);

export const DateFieldInput = createDynamicComponent<DateFieldInputProps>(
  "date-field",
  "DateFieldInput",
  _DateFieldInput,
  {},
);

export type { DateFieldProps, DateFieldRootProps, DateFieldInputProps };
