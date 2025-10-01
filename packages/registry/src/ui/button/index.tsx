"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Button as _Button,
  ButtonProvider as _ButtonProvider,
  buttonStyles,
} from "./basic";
import type { ButtonProps } from "./basic";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  _Button,
  {
    shine: React.lazy(() =>
      import("./shine").then((mod) => ({
        default: mod.Button,
      })),
    ),
    outline: React.lazy(() =>
      import("./outline").then((mod) => ({
        default: mod.Button,
      })),
    ),
    ripple: React.lazy(() =>
      import("./ripple").then((mod) => ({
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
      import("./shine").then((mod) => ({
        default: mod.ButtonProvider,
      })),
    ),
    outline: React.lazy(() =>
      import("./outline").then((mod) => ({
        default: mod.ButtonProvider,
      })),
    ),
    ripple: React.lazy(() =>
      import("./ripple").then((mod) => ({
        default: mod.ButtonProvider,
      })),
    ),
  },
);

export { buttonStyles };
export type { ButtonProps };
