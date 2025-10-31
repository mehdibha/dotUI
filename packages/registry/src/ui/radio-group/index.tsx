"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { RadioGroupProps, RadioIndicatorProps, RadioProps } from "./basic";
import {
  Radio as _Radio,
  RadioGroup as _RadioGroup,
  RadioIndicator as _RadioIndicator,
} from "./basic";

export const Radio = createDynamicComponent<RadioProps>(
  "radio-group",
  "Radio",
  _Radio,
  {},
);

export const RadioIndicator = createDynamicComponent<RadioIndicatorProps>(
  "radio-group",
  "RadioIndicator",
  _RadioIndicator,
  {},
);

export const RadioGroup = createDynamicComponent<RadioGroupProps>(
  "radio-group",
  "RadioGroup",
  _RadioGroup,
  {},
);

export type { RadioProps, RadioIndicatorProps, RadioGroupProps };
