"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  Slider as _Slider,
  SliderFiller as _SliderFiller,
  SliderRoot as _SliderRoot,
  SliderThumb as _SliderThumb,
  SliderTrack as _SliderTrack,
  SliderValueLabel as _SliderValueLabel,
} from "./basic";
import type { SliderProps } from "./basic";

export const Slider = createDynamicComponent<SliderProps>(
  "slider",
  "Slider",
  _Slider,
  {},
);

export const SliderRoot = createDynamicComponent(
  "slider",
  "SliderRoot",
  _SliderRoot,
  {},
);

export const SliderTrack = createDynamicComponent(
  "slider",
  "SliderTrack",
  _SliderTrack,
  {},
);

export const SliderFiller = createDynamicComponent(
  "slider",
  "SliderFiller",
  _SliderFiller,
  {},
);

export const SliderThumb = createDynamicComponent(
  "slider",
  "SliderThumb",
  _SliderThumb,
  {},
);

export const SliderValueLabel = createDynamicComponent(
  "slider",
  "SliderValueLabel",
  _SliderValueLabel,
  {},
);

export type { SliderProps };
