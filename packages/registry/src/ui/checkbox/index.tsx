"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { CheckboxIndicatorProps, CheckboxProps } from "./basic";
import {
  Checkbox as _Checkbox,
  CheckboxIndicator as _CheckboxIndicator,
} from "./basic";

export const Checkbox = createDynamicComponent<CheckboxProps>(
  "checkbox",
  "Checkbox",
  _Checkbox,
  {},
);

export const CheckboxIndicator = createDynamicComponent<CheckboxIndicatorProps>(
  "checkbox",
  "CheckboxIndicator",
  _CheckboxIndicator,
  {},
);

export type { CheckboxProps, CheckboxIndicatorProps };
