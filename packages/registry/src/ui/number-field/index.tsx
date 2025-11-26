"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type { NumberFieldProps } from "./types";

export const NumberField = createDynamicComponent<NumberFieldProps>(
  "number-field",
  "NumberField",
  Default.NumberField,
  {},
);

export type { NumberFieldProps };
