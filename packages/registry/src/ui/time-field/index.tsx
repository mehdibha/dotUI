"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { TimeFieldProps } from "./basic";
import { TimeField as _TimeField } from "./basic";

export const TimeField = createDynamicComponent<TimeFieldProps<any>>(
  "time-field",
  "TimeField",
  _TimeField,
  {},
);

export type { TimeFieldProps };
