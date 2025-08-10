"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { ToggleButtonGroup as _ToggleButtonGroup } from "../registry/components/toggle-button-group/basic";
import type { ToggleButtonGroupProps } from "../registry/components/toggle-button-group/basic";

export const ToggleButtonGroup = createDynamicComponent<ToggleButtonGroupProps>(
  "toggle-button-group",
  "ToggleButtonGroup",
  _ToggleButtonGroup,
  {},
);

export type { ToggleButtonGroupProps };
