"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { Badge as _Badge } from "./basic";
import type { BadgeProps } from "./basic";

export const Badge = createDynamicComponent<BadgeProps>(
  "badge",
  "Badge",
  _Badge,
  {},
);

export type { BadgeProps };
