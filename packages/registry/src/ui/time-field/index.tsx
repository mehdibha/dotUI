"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type { TimeFieldProps } from "./types";

export const TimeField = createDynamicComponent<TimeFieldProps<any>>("time-field", "TimeField", Default.TimeField, {});

export type { TimeFieldProps };
