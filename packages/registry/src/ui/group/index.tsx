"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { GroupProps } from "./basic";
import { Group as _Group } from "./basic";

export const Group = createDynamicComponent<GroupProps>(
  "group",
  "Group",
  _Group,
  {},
);

export type { GroupProps };
