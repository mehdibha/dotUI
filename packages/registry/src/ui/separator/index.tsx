"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { Separator as _Separator } from "./basic";
import type { SeparatorProps } from "./basic";

export const Separator = createDynamicComponent<SeparatorProps>(
  "separator",
  "Separator",
  _Separator,
  {},
);

export type { SeparatorProps };
