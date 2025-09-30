"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { ToggleButtonGroup as _ToggleButtonGroup } from "./basic";
import type { ToggleButtonGroupProps } from "./basic";

export const ToggleButtonGroup = createDynamicComponent<ToggleButtonGroupProps>(
  "toggle-button-group",
  "ToggleButtonGroup",
  _ToggleButtonGroup,
  {},
);

export type { ToggleButtonGroupProps };
