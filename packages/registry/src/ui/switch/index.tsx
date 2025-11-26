"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Switch as _Switch,
  SwitchIndicator as _SwitchIndicator,
  SwitchThumb as _SwitchThumb,
} from "./basic";
import type {
  SwitchIndicatorProps,
  SwitchProps,
  SwitchThumbProps,
} from "./types";

export const Switch = createDynamicComponent<SwitchProps>(
  "switch",
  "Switch",
  _Switch,
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

export type { SwitchProps, SwitchIndicatorProps, SwitchThumbProps };
