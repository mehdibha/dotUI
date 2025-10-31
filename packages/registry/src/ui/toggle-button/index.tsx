"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { ToggleButtonProps } from "./basic";
import {
  ToggleButton as _ToggleButton,
  ToggleButtonProvider as _ToggleButtonProvider,
  toggleButtonStyles,
} from "./basic";

export const ToggleButton = createDynamicComponent<ToggleButtonProps>(
  "toggle-button",
  "ToggleButton",
  _ToggleButton,
  {},
);

export const ToggleButtonProvider = createDynamicComponent(
  "toggle-button",
  "ToggleButtonProvider",
  _ToggleButtonProvider,
  {},
);

export { toggleButtonStyles };
export type { ToggleButtonProps };
