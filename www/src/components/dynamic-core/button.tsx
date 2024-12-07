"use client";

import { createDynamicComponent } from "@/lib/create-dynamic-component";
import { ButtonProps } from "@/registry/core/button-01";

export const Button = createDynamicComponent<ButtonProps>("button", "Button", {
  "button-01": () => import("@/__registry__/core/button-01"),
  "button-02": () => import("@/__registry__/core/button-02"),
});
