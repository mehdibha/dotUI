"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { TimeField as _TimeField } from "./basic";
import type { TimeFieldProps } from "./types";

export const TimeField = createDynamicComponent<TimeFieldProps<any>>(
  "time-field",
  "TimeField",
  _TimeField,
  {},
);

export type { TimeFieldProps };
