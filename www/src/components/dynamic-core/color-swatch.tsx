"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type { ColorSwatchProps } from "@/registry/core/color-swatch-01";

export const ColorSwatch = createDynamicComponent<ColorSwatchProps>(
  "color-swatch",
  "ColorSwatch",
  {
    "color-swatch-01": dynamic(
      () =>
        import("@/__registry__/core/color-swatch-01").then(
          (mod) => mod.ColorSwatch
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
