"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { SeparatorProps } from "./basic";
import { Separator as _Separator } from "./basic";

export const Separator = createDynamicComponent<SeparatorProps>(
  "separator",
  "Separator",
  _Separator,
  {},
);

export type { SeparatorProps };
