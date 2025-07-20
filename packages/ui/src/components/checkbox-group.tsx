"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  CheckboxGroup as _CheckboxGroup,
  CheckboxGroupRoot as _CheckboxGroupRoot,
} from "../registry/components/checkbox-group/basic";
import type {
  CheckboxGroupProps,
  CheckboxGroupRootProps,
} from "../registry/components/checkbox-group/basic";

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
