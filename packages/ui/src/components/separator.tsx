"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Separator as _Separator } from "../registry/components/separator/basic";
import type { SeparatorProps } from "../registry/components/separator/basic";

export const Separator = createDynamicComponent<SeparatorProps>(
  "separator",
  "Separator",
  _Separator,
  {},
);

export type { SeparatorProps };
