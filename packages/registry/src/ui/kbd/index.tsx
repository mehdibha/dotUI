"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { KbdGroupProps, KbdProps } from "./types";

export const Kbd = createDynamicComponent<KbdProps>(
  "kbd",
  "Kbd",
  Default.Kbd,
  {},
);

export const KbdGroup = createDynamicComponent<KbdGroupProps>(
  "kbd",
  "KbdGroup",
  Default.KbdGroup,
  {},
);

export type { KbdProps, KbdGroupProps };
