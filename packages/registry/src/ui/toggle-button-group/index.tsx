"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { ToggleButtonGroupProps } from "./basic";
import { ToggleButtonGroup as _ToggleButtonGroup } from "./basic";

export const ToggleButtonGroup = createDynamicComponent<ToggleButtonGroupProps>(
  "toggle-button-group",
  "ToggleButtonGroup",
  _ToggleButtonGroup,
  {},
);

export type { ToggleButtonGroupProps };
