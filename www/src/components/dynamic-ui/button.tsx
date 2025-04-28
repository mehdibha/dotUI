"use client";

import React from "react";
import {
  Button as _Button,
  ButtonProvider as _ButtonProvider,
  ButtonProps,
  buttonStyles,
} from "@/modules/registry/ui/button.basic";
import { createDynamicComponent } from "@/modules/styles/lib/create-dynamic-component";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  _Button,
  {
    basic: React.lazy(() =>
      import("@/modules/registry/ui/button.basic").then((mod) => ({
        default: mod.Button,
      }))
    ),
    brutalist: React.lazy(() =>
      import("@/modules/registry/ui/button.brutalist").then((mod) => ({
        default: mod.Button,
      }))
    ),
    ripple: React.lazy(() =>
      import("@/modules/registry/ui/button.ripple").then((mod) => ({
        default: mod.Button,
      }))
    ),
  }
);

export const ButtonProvider = createDynamicComponent(
  "button",
  "ButtonProvider",
  _ButtonProvider,
  {
    basic: React.lazy(() =>
      import("@/modules/registry/ui/button.basic").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    brutalist: React.lazy(() =>
      import("@/modules/registry/ui/button.brutalist").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    ripple: React.lazy(() =>
      import("@/modules/registry/ui/button.ripple").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
  }
);

export { buttonStyles };
export type { ButtonProps };
