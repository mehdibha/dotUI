"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { CheckboxGroupProps } from "./basic";
import { CheckboxGroup as _CheckboxGroup } from "./basic";

export const CheckboxGroup = createDynamicComponent<CheckboxGroupProps>(
  "checkbox-group",
  "CheckboxGroup",
  _CheckboxGroup,
  {},
);

export type { CheckboxGroupProps };
