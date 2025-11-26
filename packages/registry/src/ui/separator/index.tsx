"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Separator as _Separator } from "./basic";
import type { SeparatorProps } from "./types";

export const Separator = createDynamicComponent<SeparatorProps>(
  "separator",
  "Separator",
  _Separator,
  {},
);

export type { SeparatorProps };
