"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  CheckboxGroup as _CheckboxGroup,
  CheckboxGroupRoot as _CheckboxGroupRoot,
} from "./basic";
import type { CheckboxGroupProps, CheckboxGroupRootProps } from "./basic";

export const CheckboxGroup = createDynamicComponent<CheckboxGroupProps>(
  "checkbox-group",
  "CheckboxGroup",
  _CheckboxGroup,
  {},
);

export const CheckboxGroupRoot = createDynamicComponent<CheckboxGroupRootProps>(
  "checkbox-group",
  "CheckboxGroupRoot",
  _CheckboxGroupRoot,
  {},
);

export type { CheckboxGroupProps, CheckboxGroupRootProps };
