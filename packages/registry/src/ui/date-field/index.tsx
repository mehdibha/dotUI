"use client";

import type { DateValue } from "react-aria-components";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { DateField as _DateField } from "./basic";
import type { DateFieldProps } from "./types";

export const DateField = <T extends DateValue>(props: DateFieldProps<T>) => {
  const Component = createDynamicComponent<DateFieldProps<T>>(
    "date-field",
    "DateField",
    _DateField,
    {},
  );

  return <Component {...props} />;
};

export type { DateFieldProps };
