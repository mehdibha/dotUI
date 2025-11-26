"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Badge as _Badge } from "./basic";
import type { BadgeProps } from "./types";

export const Badge = createDynamicComponent<BadgeProps>(
  "badge",
  "Badge",
  _Badge,
  {},
);

export type { BadgeProps };
