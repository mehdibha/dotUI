"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  ToggleButton as _ToggleButton,
  ToggleButtonProvider as _ToggleButtonProvider,
  toggleButtonStyles,
} from "../registry/components/toggle-button/basic";
import type { ToggleButtonProps } from "../registry/components/toggle-button/basic";

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
