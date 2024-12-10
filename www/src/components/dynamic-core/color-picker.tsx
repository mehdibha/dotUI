"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type {
  ColorPickerProps,
  ColorPickerRootProps,
  ColorEditorProps,
} from "@/registry/core/color-picker-01";

export const ColorPicker = createDynamicComponent<ColorPickerProps>(
  "color-picker",
  "ColorPicker",
  {
    "color-picker-01": dynamic(
      () =>
        import("@/__registry__/core/color-picker-01").then(
          (mod) => mod.ColorPicker
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);

export const ColorPickerRoot = createDynamicComponent<ColorPickerRootProps>(
  "color-picker",
  "Badge",
  {
    "color-picker-01": dynamic(
      () =>
        import("@/__registry__/core/color-picker-01").then(
          (mod) => mod.ColorPickerRoot
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);

export const ColorEditor = createDynamicComponent<ColorEditorProps>(
  "color-picker",
  "ColorEditor",
  {
    "color-picker-01": dynamic(
      () =>
        import("@/__registry__/core/color-picker-01").then(
          (mod) => mod.ColorEditor
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
