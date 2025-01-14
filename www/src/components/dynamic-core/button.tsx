"use client";

import React from "react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import { ButtonProps } from "@/registry/core/button-01";

export const Button = createDynamicComponent<ButtonProps>("button", "Button", {
  "button-01": React.lazy(() =>
    import("@/registry/core/button-01").then((mod) => ({
      default: mod.Button,
    }))
  ),
  "button-02": React.lazy(() =>
    import("@/registry/core/button-02").then((mod) => ({
      default: mod.Button,
    }))
  ),
  "button-03": React.lazy(() =>
    import("@/registry/core/button-03").then((mod) => ({
      default: mod.Button,
    }))
  ),
  "button-04": React.lazy(() =>
    import("@/registry/core/button-04").then((mod) => ({
      default: mod.Button,
    }))
  ),
});

export const ButtonProvider = createDynamicComponent(
  "button",
  "ButtonProvider",
  {
    "button-01": React.lazy(() =>
      import("@/registry/core/button-01").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    "button-02": React.lazy(() =>
      import("@/registry/core/button-02").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    "button-03": React.lazy(() =>
      import("@/registry/core/button-03").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
    "button-04": React.lazy(() =>
      import("@/registry/core/button-04").then((mod) => ({
        default: mod.ButtonProvider,
      }))
    ),
  }
);
