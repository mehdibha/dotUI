"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Kbd as _Kbd, KbdGroup as _KbdGroup } from "./basic";
import type { KbdGroupProps, KbdProps } from "./types";

export const Kbd = createDynamicComponent<KbdProps>("kbd", "Kbd", _Kbd, {});

export const KbdGroup = createDynamicComponent<KbdGroupProps>(
  "kbd",
  "KbdGroup",
  _KbdGroup,
  {},
);

export type { KbdProps, KbdGroupProps };
