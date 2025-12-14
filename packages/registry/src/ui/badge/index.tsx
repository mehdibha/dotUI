"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { BadgeProps } from "./types";

export const Badge = createDynamicComponent<BadgeProps>(
  "badge",
  "Badge",
  Default.Badge,
  {},
);

export type { BadgeProps };
