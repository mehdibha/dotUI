"use client";

import React from "react";

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
  {
    basic: React.lazy(() =>
      import("../registry/components/date-picker/basic").then((mod) => ({
        default: mod.DatePicker,
      })),
    ),
  },
);

export const DatePickerRoot = createDynamicComponent<DatePickerRootProps<any>>(
  "date-picker",
  "DatePickerRoot",
  _DatePickerRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/date-picker/basic").then((mod) => ({
        default: mod.DatePickerRoot,
      })),
    ),
  },
);

export type { DatePickerProps, DatePickerRootProps };
