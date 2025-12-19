"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type { TimeFieldProps } from "./types";

export const TimeField = createDynamicComponent<TimeFieldProps<any>>("time-field", "TimeField", Default.TimeField, {});

export type { TimeFieldProps };
