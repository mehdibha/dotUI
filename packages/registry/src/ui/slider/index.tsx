"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { SliderControlProps, SliderFillerProps, SliderOutputProps, SliderProps, SliderThumbProps } from "./types";

export const Slider = createDynamicComponent<SliderProps>("slider", "Slider", Default.Slider, {});

export const SliderControl = createDynamicComponent<SliderControlProps>(
	"slider",
	"SliderControl",
	Default.SliderControl,
	{},
);

export const SliderFiller = createDynamicComponent<SliderFillerProps>(
	"slider",
	"SliderFiller",
	Default.SliderFiller,
	{},
);

export const SliderThumb = createDynamicComponent<SliderThumbProps>("slider", "SliderThumb", Default.SliderThumb, {});

export const SliderOutput = createDynamicComponent<SliderOutputProps>(
	"slider",
	"SliderOutput",
	Default.SliderOutput,
	{},
);

export type { SliderProps, SliderControlProps, SliderFillerProps, SliderThumbProps, SliderOutputProps };
