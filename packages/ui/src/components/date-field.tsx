"use client";

import React from "react";

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
  {
    basic: React.lazy(() =>
      import("../registry/components/date-field/basic").then((mod) => ({
        default: mod.DateField,
      })),
    ),
  },
);

export const DateFieldRoot = createDynamicComponent<DateFieldRootProps<any>>(
  "date-field",
  "DateFieldRoot",
  _DateFieldRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/date-field/basic").then((mod) => ({
        default: mod.DateFieldRoot,
      })),
    ),
  },
);

export const DateFieldInput = createDynamicComponent<DateFieldInputProps>(
  "date-field",
  "DateFieldInput",
  _DateFieldInput,
  {
    basic: React.lazy(() =>
      import("../registry/components/date-field/basic").then((mod) => ({
        default: mod.DateFieldInput,
      })),
    ),
  },
);

export type { DateFieldProps, DateFieldRootProps, DateFieldInputProps };
