"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type { ColorThumbProps } from "@/registry/core/color-thumb-01";

export const ColorThumb = createDynamicComponent<ColorThumbProps>(
  "color-thumb",
  "ColorThumb",
  {
    "color-thumb-01": dynamic(
      () =>
        import("@/__registry__/core/color-thumb-01").then(
          (mod) => mod.ColorThumb
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
