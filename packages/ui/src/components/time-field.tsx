"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  TimeField as _TimeField,
  TimeFieldInput as _TimeFieldInput,
  TimeFieldRoot as _TimeFieldRoot,
} from "../registry/components/time-field/basic";
import type {
  TimeFieldInputProps,
  TimeFieldProps,
  TimeFieldRootProps,
} from "../registry/components/time-field/basic";

export const TimeField = createDynamicComponent<TimeFieldProps<any>>(
  "time-field",
  "TimeField",
  _TimeField,
  {
    basic: React.lazy(() =>
      import("../registry/components/time-field/basic").then((mod) => ({
        default: mod.TimeField,
      })),
    ),
  },
);

export const TimeFieldRoot = createDynamicComponent<TimeFieldRootProps<any>>(
  "time-field",
  "TimeFieldRoot",
  _TimeFieldRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/time-field/basic").then((mod) => ({
        default: mod.TimeFieldRoot,
      })),
    ),
  },
);

export const TimeFieldInput = createDynamicComponent<TimeFieldInputProps>(
  "time-field",
  "TimeFieldInput",
  _TimeFieldInput,
  {
    basic: React.lazy(() =>
      import("../registry/components/time-field/basic").then((mod) => ({
        default: mod.TimeFieldInput,
      })),
    ),
  },
);

export type { TimeFieldProps, TimeFieldRootProps, TimeFieldInputProps };
