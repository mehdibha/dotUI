"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { TimeFieldProps } from "./types";

export const TimeField = createDynamicComponent<TimeFieldProps<any>>(
  "time-field",
  "TimeField",
  Default.TimeField,
  {},
);

export type { TimeFieldProps };
