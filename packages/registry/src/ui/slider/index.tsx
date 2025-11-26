"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Slider as _Slider,
  SliderControl as _SliderControl,
  SliderFiller as _SliderFiller,
  SliderOutput as _SliderOutput,
  SliderThumb as _SliderThumb,
} from "./basic";
import type {
  SliderControlProps,
  SliderFillerProps,
  SliderOutputProps,
  SliderProps,
  SliderThumbProps,
} from "./types";

export const Slider = createDynamicComponent<SliderProps>(
  "slider",
  "Slider",
  _Slider,
  {},
);

export const SliderControl = createDynamicComponent<SliderControlProps>(
  "slider",
  "SliderControl",
  _SliderControl,
  {},
);

export const SliderFiller = createDynamicComponent<SliderFillerProps>(
  "slider",
  "SliderFiller",
  _SliderFiller,
  {},
);

export const SliderThumb = createDynamicComponent<SliderThumbProps>(
  "slider",
  "SliderThumb",
  _SliderThumb,
  {},
);

export const SliderOutput = createDynamicComponent<SliderOutputProps>(
  "slider",
  "SliderOutput",
  _SliderOutput,
  {},
);

export type {
  SliderProps,
  SliderControlProps,
  SliderFillerProps,
  SliderThumbProps,
  SliderOutputProps,
};
