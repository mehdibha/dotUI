"use client";

import React from "react";

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
  {
    basic: React.lazy(() =>
      import("../registry/components/toggle-button/basic").then((mod) => ({
        default: mod.ToggleButton,
      })),
    ),
  },
);

export const ToggleButtonProvider = createDynamicComponent(
  "toggle-button",
  "ToggleButtonProvider",
  _ToggleButtonProvider,
  {
    basic: React.lazy(() =>
      import("../registry/components/toggle-button/basic").then((mod) => ({
        default: mod.ToggleButtonProvider,
      })),
    ),
  },
);

export { toggleButtonStyles };
export type { ToggleButtonProps };
