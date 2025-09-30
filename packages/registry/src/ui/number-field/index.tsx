"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  NumberField as _NumberField,
  NumberFieldRoot as _NumberFieldRoot,
} from "./basic";
import type { NumberFieldProps, NumberFieldRootProps } from "./basic";

export const NumberField = createDynamicComponent<NumberFieldProps>(
  "number-field",
  "NumberField",
  _NumberField,
  {},
);

export const NumberFieldRoot = createDynamicComponent<NumberFieldRootProps>(
  "number-field",
  "NumberFieldRoot",
  _NumberFieldRoot,
  {},
);

export type { NumberFieldProps, NumberFieldRootProps };
