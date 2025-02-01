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
    "button-01": React.lazy(() =>
      import("@/registry/core/button_basic").then((mod) => ({
        default: mod.Button,
      }))
    ),
    "button-02": React.lazy(() =>
      import("@/registry/core/button-02").then((mod) => ({
        default: mod.Button,
      }))
    ),
    "button-03": React.lazy(() =>
      import("@/registry/core/button_brutalist").then((mod) => ({
        default: mod.Button,
      }))
    ),
    "button-04": React.lazy(() =>
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
    "button-01": React.lazy(() =>
      import("@/registry/core/button_basic").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    "button-02": React.lazy(() =>
      import("@/registry/core/button-02").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    "button-03": React.lazy(() =>
      import("@/registry/core/button_brutalist").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    "button-04": React.lazy(() =>
      import("@/registry/core/button_ripple").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
  }
);
