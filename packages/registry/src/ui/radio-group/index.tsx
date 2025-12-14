"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { RadioGroupProps, RadioIndicatorProps, RadioProps } from "./types";

export const Radio = createDynamicComponent<RadioProps>(
  "radio-group",
  "Radio",
  Default.Radio,
  {},
);

export const RadioIndicator = createDynamicComponent<RadioIndicatorProps>(
  "radio-group",
  "RadioIndicator",
  Default.RadioIndicator,
  {},
);

export const RadioGroup = createDynamicComponent<RadioGroupProps>(
  "radio-group",
  "RadioGroup",
  Default.RadioGroup,
  {},
);

export type { RadioProps, RadioIndicatorProps, RadioGroupProps };
