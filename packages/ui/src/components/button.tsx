"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Button as _Button,
  ButtonProvider as _ButtonProvider,
  buttonStyles,
} from "../registry/components/button/basic";
import type { ButtonProps } from "../registry/components/button/basic";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  _Button,
  {
    shine: React.lazy(() =>
      import("../registry/components/button/shine").then((mod) => ({
        default: mod.Button,
      })),
    ),
    outline: React.lazy(() =>
      import("../registry/components/button/outline").then((mod) => ({
        default: mod.Button,
      })),
    ),
    ripple: React.lazy(() =>
      import("../registry/components/button/ripple").then((mod) => ({
        default: mod.Button,
      })),
    ),
  },
);

export const ButtonProvider = createDynamicComponent(
  "button",
  "ButtonProvider",
  _ButtonProvider,
  {
    shine: React.lazy(() =>
      import("../registry/components/button/shine").then((mod) => ({
        default: mod.ButtonProvider,
      })),
    ),
    outline: React.lazy(() =>
      import("../registry/components/button/outline").then((mod) => ({
        default: mod.ButtonProvider,
      })),
    ),
    ripple: React.lazy(() =>
      import("../registry/components/button/ripple").then((mod) => ({
        default: mod.ButtonProvider,
      })),
    ),
  },
);

export { buttonStyles };
export type { ButtonProps };
