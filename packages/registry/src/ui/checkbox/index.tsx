"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { CheckboxIndicatorProps, CheckboxProps } from "./types";

export const Checkbox = createDynamicComponent<CheckboxProps>(
  "checkbox",
  "Checkbox",
  Default.Checkbox,
  {},
);

export const CheckboxIndicator = createDynamicComponent<CheckboxIndicatorProps>(
  "checkbox",
  "CheckboxIndicator",
  Default.CheckboxIndicator,
  {},
);

export type { CheckboxProps, CheckboxIndicatorProps };
