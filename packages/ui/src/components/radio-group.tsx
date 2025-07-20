"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Radio as _Radio,
  RadioGroup as _RadioGroup,
  RadioGroupRoot as _RadioGroupRoot,
  RadioIndicator as _RadioIndicator,
  RadioRoot as _RadioRoot,
} from "../registry/components/radio-group/basic";
import type {
  RadioGroupProps,
  RadioGroupRootProps,
  RadioIndicatorProps,
  RadioProps,
  RadioRootProps,
} from "../registry/components/radio-group/basic";

export const Radio = createDynamicComponent<RadioProps>(
  "radio-group",
  "Radio",
  _Radio,
  {
    basic: React.lazy(() =>
      import("../registry/components/radio-group/basic").then((mod) => ({
        default: mod.Radio,
      })),
    ),
  },
);

export const RadioRoot = createDynamicComponent<RadioRootProps>(
  "radio-group",
  "RadioRoot",
  _RadioRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/radio-group/basic").then((mod) => ({
        default: mod.RadioRoot,
      })),
    ),
  },
);

export const RadioIndicator = createDynamicComponent<RadioIndicatorProps>(
  "radio-group",
  "RadioIndicator",
  _RadioIndicator,
  {
    basic: React.lazy(() =>
      import("../registry/components/radio-group/basic").then((mod) => ({
        default: mod.RadioIndicator,
      })),
    ),
  },
);

export const RadioGroup = createDynamicComponent<RadioGroupProps>(
  "radio-group",
  "RadioGroup",
  _RadioGroup,
  {
    basic: React.lazy(() =>
      import("../registry/components/radio-group/basic").then((mod) => ({
        default: mod.RadioGroup,
      })),
    ),
  },
);

export const RadioGroupRoot = createDynamicComponent<RadioGroupRootProps>(
  "radio-group",
  "RadioGroupRoot",
  _RadioGroupRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/radio-group/basic").then((mod) => ({
        default: mod.RadioGroupRoot,
      })),
    ),
  },
);

export type {
  RadioProps,
  RadioRootProps,
  RadioIndicatorProps,
  RadioGroupProps,
  RadioGroupRootProps,
};
