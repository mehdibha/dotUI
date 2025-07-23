"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  DateField as _DateField,
  DateFieldInput as _DateFieldInput,
  DateFieldRoot as _DateFieldRoot,
} from "../registry/components/date-field/basic";
import type {
  DateFieldInputProps,
  DateFieldProps,
  DateFieldRootProps,
} from "../registry/components/date-field/basic";

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
