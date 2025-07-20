"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Slider as _Slider,
  SliderFiller as _SliderFiller,
  SliderRoot as _SliderRoot,
  SliderThumb as _SliderThumb,
  SliderTrack as _SliderTrack,
  SliderValueLabel as _SliderValueLabel,
} from "../registry/components/slider/basic";
import type { SliderProps } from "../registry/components/slider/basic";

export const Slider = createDynamicComponent<SliderProps>(
  "slider",
  "Slider",
  _Slider,
  {
    basic: React.lazy(() =>
      import("../registry/components/slider/basic").then((mod) => ({
        default: mod.Slider,
      })),
    ),
  },
);

export const SliderRoot = createDynamicComponent(
  "slider",
  "SliderRoot",
  _SliderRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/slider/basic").then((mod) => ({
        default: mod.SliderRoot,
      })),
    ),
  },
);

export const SliderTrack = createDynamicComponent(
  "slider",
  "SliderTrack",
  _SliderTrack,
  {
    basic: React.lazy(() =>
      import("../registry/components/slider/basic").then((mod) => ({
        default: mod.SliderTrack,
      })),
    ),
  },
);

export const SliderFiller = createDynamicComponent(
  "slider",
  "SliderFiller",
  _SliderFiller,
  {
    basic: React.lazy(() =>
      import("../registry/components/slider/basic").then((mod) => ({
        default: mod.SliderFiller,
      })),
    ),
  },
);

export const SliderThumb = createDynamicComponent(
  "slider",
  "SliderThumb",
  _SliderThumb,
  {
    basic: React.lazy(() =>
      import("../registry/components/slider/basic").then((mod) => ({
        default: mod.SliderThumb,
      })),
    ),
  },
);

export const SliderValueLabel = createDynamicComponent(
  "slider",
  "SliderValueLabel",
  _SliderValueLabel,
  {
    basic: React.lazy(() =>
      import("../registry/components/slider/basic").then((mod) => ({
        default: mod.SliderValueLabel,
      })),
    ),
  },
);

export type { SliderProps };
