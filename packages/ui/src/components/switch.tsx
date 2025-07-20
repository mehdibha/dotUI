"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Switch as _Switch,
  SwitchIndicator as _SwitchIndicator,
  SwitchRoot as _SwitchRoot,
  SwitchThumb as _SwitchThumb,
} from "../registry/components/switch/basic";
import type {
  SwitchIndicatorProps,
  SwitchProps,
  SwitchRootProps,
  SwitchThumbProps,
} from "../registry/components/switch/basic";

export const Switch = createDynamicComponent<SwitchProps>(
  "switch",
  "Switch",
  _Switch,
  {
    basic: React.lazy(() =>
      import("../registry/components/switch/basic").then((mod) => ({
        default: mod.Switch,
      })),
    ),
  },
);

export const SwitchRoot = createDynamicComponent<SwitchRootProps>(
  "switch",
  "SwitchRoot",
  _SwitchRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/switch/basic").then((mod) => ({
        default: mod.SwitchRoot,
      })),
    ),
  },
);

export const SwitchIndicator = createDynamicComponent<SwitchIndicatorProps>(
  "switch",
  "SwitchIndicator",
  _SwitchIndicator,
  {
    basic: React.lazy(() =>
      import("../registry/components/switch/basic").then((mod) => ({
        default: mod.SwitchIndicator,
      })),
    ),
  },
);

export const SwitchThumb = createDynamicComponent<SwitchThumbProps>(
  "switch",
  "SwitchThumb",
  _SwitchThumb,
  {
    basic: React.lazy(() =>
      import("../registry/components/switch/basic").then((mod) => ({
        default: mod.SwitchThumb,
      })),
    ),
  },
);

export type {
  SwitchProps,
  SwitchRootProps,
  SwitchIndicatorProps,
  SwitchThumbProps,
};
