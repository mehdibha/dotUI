"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type { GroupProps } from "./types";

export const Group = createDynamicComponent<GroupProps>(
  "group",
  "Group",
  Default.Group,
  {},
);

export type { GroupProps };
