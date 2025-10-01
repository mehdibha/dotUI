"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Checkbox as _Checkbox,
  CheckboxIndicator as _CheckboxIndicator,
  CheckboxProvider as _CheckboxProvider,
  CheckboxRoot as _CheckboxRoot,
  checkboxStyles,
} from "./basic";
import type {
  CheckboxIndicatorProps,
  CheckboxProps,
  CheckboxRootProps,
} from "./basic";

export const Checkbox = createDynamicComponent<CheckboxProps>(
  "checkbox",
  "Checkbox",
  _Checkbox,
  {},
);

export const CheckboxRoot = createDynamicComponent<CheckboxRootProps>(
  "checkbox",
  "CheckboxRoot",
  _CheckboxRoot,
  {},
);

export const CheckboxIndicator = createDynamicComponent<CheckboxIndicatorProps>(
  "checkbox",
  "CheckboxIndicator",
  _CheckboxIndicator,
  {},
);

export const CheckboxProvider = createDynamicComponent(
  "checkbox",
  "CheckboxProvider",
  _CheckboxProvider,
  {},
);

export { checkboxStyles };
export type { CheckboxProps, CheckboxRootProps, CheckboxIndicatorProps };
