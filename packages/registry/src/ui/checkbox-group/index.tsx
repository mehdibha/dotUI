"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { CheckboxGroup as _CheckboxGroup } from "./basic";
import type { CheckboxGroupProps } from "./types";

export const CheckboxGroup = createDynamicComponent<CheckboxGroupProps>(
  "checkbox-group",
  "CheckboxGroup",
  _CheckboxGroup,
  {},
);

export type { CheckboxGroupProps };
