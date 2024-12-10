"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type {
  ColorFieldProps,
  ColorFieldRootProps,
} from "@/registry/core/color-field-01";

export const ColorField = createDynamicComponent<ColorFieldProps>(
  "color-field",
  "ColorField",
  {
    "color-field-01": dynamic(
      () =>
        import("@/__registry__/core/color-field-01").then(
          (mod) => mod.ColorField
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
export const ColorFieldRoot = createDynamicComponent<ColorFieldRootProps>(
  "color-field",
  "ColorFieldRoot",
  {
    "color-field-01": dynamic(
      () =>
        import("@/__registry__/core/color-field-01").then(
          (mod) => mod.ColorFieldRoot
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
