"use client";

import React from "react";
import { createDynamicComponent } from "@/modules/themes";
import {
  Button as _Button,
  ButtonProvider as _ButtonProvider,
  ButtonProps,
} from "@/reg/ui/button.basic";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  _Button,
  {
    basic: React.lazy(() =>
      import("@/reg/ui/button.basic").then((mod) => ({
        default: mod.Button,
      }))
    ),
    brutalist: React.lazy(() =>
      import("@/reg/ui/button.brutalist").then((mod) => ({
        default: mod.Button,
      }))
    ),
    ripple: React.lazy(() =>
      import("@/reg/ui/button.ripple").then((mod) => ({
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
      import("@/reg/ui/button.basic").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    brutalist: React.lazy(() =>
      import("@/reg/ui/button.brutalist").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    ripple: React.lazy(() =>
      import("@/reg/ui/button.ripple").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
  }
);
