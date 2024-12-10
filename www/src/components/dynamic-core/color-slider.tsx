"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type {
  ColorSliderProps,
  ColorSliderRootProps,
  ColorSliderOutputProps,
  ColorSliderTrackProps,
} from "@/registry/core/color-slider-01";

export const ColorSlider = createDynamicComponent<ColorSliderProps>(
  "color-slider",
  "ColorSlider",
  {
    "color-slider-01": dynamic(
      () =>
        import("@/__registry__/core/color-slider-01").then(
          (mod) => mod.ColorSlider
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
export const ColorSliderRoot = createDynamicComponent<ColorSliderRootProps>(
  "color-slider",
  "ColorSliderRoot",
  {
    "color-slider-01": dynamic(
      () =>
        import("@/__registry__/core/color-slider-01").then(
          (mod) => mod.ColorSliderRoot
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
export const ColorSliderOutput = createDynamicComponent<ColorSliderOutputProps>(
  "color-slider",
  "ColorSliderOutput",
  {
    "color-slider-01": dynamic(
      () =>
        import("@/__registry__/core/color-slider-01").then(
          (mod) => mod.ColorSliderOutput
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
export const ColorSliderTrack = createDynamicComponent<ColorSliderTrackProps>(
  "color-slider",
  "ColorSliderTrack",
  {
    "color-slider-01": dynamic(
      () =>
        import("@/__registry__/core/color-slider-01").then(
          (mod) => mod.ColorSliderTrack
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
