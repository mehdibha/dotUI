"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  ToggleButton as _ToggleButton,
  ToggleButtonProvider as _ToggleButtonProvider,
  toggleButtonStyles,
} from "./basic";
import type { ToggleButtonProps } from "./basic";

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
