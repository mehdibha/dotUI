"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { ToggleButtonGroup as _ToggleButtonGroup } from "./basic";
import type { ToggleButtonGroupProps } from "./types";

export const ToggleButtonGroup = createDynamicComponent<ToggleButtonGroupProps>(
  "toggle-button-group",
  "ToggleButtonGroup",
  _ToggleButtonGroup,
  {},
);

export type { ToggleButtonGroupProps };
