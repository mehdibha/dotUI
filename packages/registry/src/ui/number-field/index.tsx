"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { NumberField as _NumberField } from "./basic";
import type { NumberFieldProps } from "./types";

export const NumberField = createDynamicComponent<NumberFieldProps>(
  "number-field",
  "NumberField",
  _NumberField,
  {},
);

export type { NumberFieldProps };
