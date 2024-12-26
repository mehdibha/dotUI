// export * from "@/registry/core/button-02";
"use client";

import React from "react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import { ButtonProps } from "@/registry/core/button-01";
import { buttonStyles as buttonStyles01 } from "@/registry/core/button-01";

export const Button = createDynamicComponent<ButtonProps>("button", "Button", {
  "button-01": React.lazy(() =>
    import("@/__registry__/core/button-01").then((mod) => ({
      default: mod.Button,
    }))
  ),
  "button-02": React.lazy(() =>
    import("@/__registry__/core/button-02").then((mod) => ({
      default: mod.Button,
    }))
  ),
  "button-03": React.lazy(() =>
    import("@/__registry__/core/button-03").then((mod) => ({
      default: mod.Button,
    }))
  ),
  "button-04": React.lazy(() =>
    import("@/__registry__/core/button-04").then((mod) => ({
      default: mod.Button,
    }))
  ),
});

export const buttonStyles = buttonStyles01;
