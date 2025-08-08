"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Badge as _Badge } from "../registry/components/badge/basic";
import type { BadgeProps } from "../registry/components/badge/basic";

export const Badge = createDynamicComponent<BadgeProps>(
  "badge",
  "Badge",
  _Badge,
  {},
);

export type { BadgeProps };
