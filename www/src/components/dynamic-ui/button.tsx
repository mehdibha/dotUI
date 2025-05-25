"use client";

import React from "react";
import {
  Button as _Button,
  ButtonProvider as _ButtonProvider,
  ButtonProps,
  buttonStyles,
} from "@/__registry__/ui/button.basic";
import { createDynamicComponent } from "@/modules/styles/lib/create-dynamic-component";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  _Button,
  {
    "outline": React.lazy(() =>
      import("@/__registry__/ui/button.outline").then((mod) => ({
        default: mod.Button,
      }))
    ),
    brutalist: React.lazy(() =>
      import("@/__registry__/ui/button.brutalist").then((mod) => ({
        default: mod.Button,
      }))
    ),
    ripple: React.lazy(() =>
      import("@/__registry__/ui/button.ripple").then((mod) => ({
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
    "outline": React.lazy(() =>
      import("@/__registry__/ui/button.outline").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    brutalist: React.lazy(() =>
      import("@/__registry__/ui/button.brutalist").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    ripple: React.lazy(() =>
      import("@/__registry__/ui/button.ripple").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
  }
);

export { buttonStyles };
export type { ButtonProps };
