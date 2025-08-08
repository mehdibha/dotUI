"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  DateInput as _DateInput,
  DateSegment as _DateSegment,
} from "../registry/components/date-input/basic";
import type {
  DateInputProps,
  DateSegmentProps,
} from "../registry/components/date-input/basic";

export const DateInput = createDynamicComponent<DateInputProps>(
  "date-input",
  "DateInput",
  _DateInput,
  {},
);

export const DateSegment = createDynamicComponent<DateSegmentProps>(
  "date-input",
  "DateSegment",
  _DateSegment,
  {},
);

export type { DateInputProps, DateSegmentProps };
