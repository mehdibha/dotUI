"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type {
  CheckboxGroupProps,
  CheckboxGroupRootProps,
} from "@/registry/core/checkbox-group-01";

export const CheckboxGroup = createDynamicComponent<CheckboxGroupProps>(
  "checkbox-group",
  "CheckboxGroup",
  {
    "checkbox-group-01": dynamic(
      () =>
        import("@/__registry__/core/checkbox-group-01").then(
          (mod) => mod.CheckboxGroup
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);

export const CheckboxGroupRoot = createDynamicComponent<CheckboxGroupRootProps>(
  "checkbox-group",
  "CheckboxGroupRoot",
  {
    "checkbox-group-01": dynamic(
      () =>
        import("@/__registry__/core/checkbox-group-01").then(
          (mod) => mod.CheckboxGroupRoot
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
