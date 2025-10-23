"use client";

import type { DateValue } from "react-aria-components";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  DateFieldInputProps,
  DateFieldProps,
  DateFieldRootProps,
} from "./basic";
import {
  DateField as _DateField,
  DateFieldInput as _DateFieldInput,
  DateFieldRoot as _DateFieldRoot,
} from "./basic";

export const DateField = <T extends DateValue>(props: DateFieldProps<T>) => {
  const Component = createDynamicComponent<DateFieldProps<T>>(
    "date-field",
    "DateField",
    _DateField,
    {},
  );

  return <Component {...props} />;
};

export const DateFieldRoot = <T extends DateValue>(
  props: DateFieldRootProps<T>,
) => {
  const Component = createDynamicComponent<DateFieldRootProps<T>>(
    "date-field",
    "DateFieldRoot",
    _DateFieldRoot,
    {},
  );
  return <Component {...props} />;
};

export const DateFieldInput = createDynamicComponent<DateFieldInputProps>(
  "date-field",
  "DateFieldInput",
  _DateFieldInput,
  {},
);

export type { DateFieldProps, DateFieldRootProps, DateFieldInputProps };
