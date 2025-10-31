"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { NumberFieldProps } from "./basic";
import { NumberField as _NumberField } from "./basic";

export const NumberField = createDynamicComponent<NumberFieldProps>(
  "number-field",
  "NumberField",
  _NumberField,
  {},
);

export type { NumberFieldProps };
