"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { BadgeProps } from "./basic";
import { Badge as _Badge } from "./basic";

export const Badge = createDynamicComponent<BadgeProps>(
  "badge",
  "Badge",
  _Badge,
  {},
);

export type { BadgeProps };
