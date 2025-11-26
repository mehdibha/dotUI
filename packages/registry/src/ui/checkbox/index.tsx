"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Checkbox as _Checkbox,
  CheckboxIndicator as _CheckboxIndicator,
} from "./basic";
import type { CheckboxIndicatorProps, CheckboxProps } from "./types";

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
