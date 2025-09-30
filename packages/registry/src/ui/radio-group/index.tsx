"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  Radio as _Radio,
  RadioGroup as _RadioGroup,
  RadioGroupRoot as _RadioGroupRoot,
  RadioIndicator as _RadioIndicator,
  RadioRoot as _RadioRoot,
} from "./basic";
import type {
  RadioGroupProps,
  RadioGroupRootProps,
  RadioIndicatorProps,
  RadioProps,
  RadioRootProps,
} from "./basic";

export const Radio = createDynamicComponent<RadioProps>(
  "radio-group",
  "Radio",
  _Radio,
  {},
);

export const RadioRoot = createDynamicComponent<RadioRootProps>(
  "radio-group",
  "RadioRoot",
  _RadioRoot,
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

export const RadioGroupRoot = createDynamicComponent<RadioGroupRootProps>(
  "radio-group",
  "RadioGroupRoot",
  _RadioGroupRoot,
  {},
);

export type {
  RadioProps,
  RadioRootProps,
  RadioIndicatorProps,
  RadioGroupProps,
  RadioGroupRootProps,
};
