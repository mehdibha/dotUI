"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  NumberField as _NumberField,
  NumberFieldRoot as _NumberFieldRoot,
} from "../registry/components/number-field/basic";
import type {
  NumberFieldProps,
  NumberFieldRootProps,
} from "../registry/components/number-field/basic";

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
