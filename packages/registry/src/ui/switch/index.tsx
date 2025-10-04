"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Switch as _Switch,
  SwitchIndicator as _SwitchIndicator,
  SwitchProvider as _SwitchProvider,
  SwitchRoot as _SwitchRoot,
  SwitchThumb as _SwitchThumb,
} from "./basic";
import type {
  SwitchIndicatorProps,
  SwitchProps,
  SwitchRootProps,
  SwitchThumbProps,
} from "./basic";

export const Switch = createDynamicComponent<SwitchProps>(
  "switch",
  "Switch",
  _Switch,
  {},
);

export const SwitchRoot = createDynamicComponent<SwitchRootProps>(
  "switch",
  "SwitchRoot",
  _SwitchRoot,
  {},
);

export const SwitchIndicator = createDynamicComponent<SwitchIndicatorProps>(
  "switch",
  "SwitchIndicator",
  _SwitchIndicator,
  {},
);

export const SwitchThumb = createDynamicComponent<SwitchThumbProps>(
  "switch",
  "SwitchThumb",
  _SwitchThumb,
  {},
);

export const SwitchProvider = createDynamicComponent(
  "switch",
  "SwitchProvider",
  _SwitchProvider,
  {},
);

export type { SwitchProps, SwitchRootProps, SwitchIndicatorProps };
