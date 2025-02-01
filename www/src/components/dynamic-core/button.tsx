"use client";

import React from "react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import {
  Button as _Button,
  ButtonProvider as _ButtonProvider,
  ButtonProps,
} from "@/registry/core/button_basic";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  _Button,
  {
    basic: React.lazy(() =>
      import("@/registry/core/button_basic").then((mod) => ({
        default: mod.Button,
      }))
    ),
    brutalist: React.lazy(() =>
      import("@/registry/core/button_brutalist").then((mod) => ({
        default: mod.Button,
      }))
    ),
    ripple: React.lazy(() =>
      import("@/registry/core/button_ripple").then((mod) => ({
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
      import("@/registry/core/button_basic").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    brutalist: React.lazy(() =>
      import("@/registry/core/button_brutalist").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    ripple: React.lazy(() =>
      import("@/registry/core/button_ripple").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
  }
);
