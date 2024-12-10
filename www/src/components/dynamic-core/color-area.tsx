"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type {
  ColorAreaProps,
  ColorAreaRootProps,
} from "@/registry/core/color-area-01";

export const ColorArea = createDynamicComponent<ColorAreaProps>(
  "color-area",
  "ColorArea",
  {
    "color-area-01": dynamic(
      () =>
        import("@/__registry__/core/color-area-01").then(
          (mod) => mod.ColorArea
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);

export const ColorAreaRoot = createDynamicComponent<ColorAreaRootProps>(
  "color-area",
  "ColorAreaRoot",
  {
    "color-area-01": dynamic(
      () =>
        import("@/__registry__/core/color-area-01").then(
          (mod) => mod.ColorAreaRoot
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
