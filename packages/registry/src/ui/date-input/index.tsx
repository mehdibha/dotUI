"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { DateInput as _DateInput, DateSegment as _DateSegment } from "./basic";
import type { DateInputProps, DateSegmentProps } from "./basic";

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
