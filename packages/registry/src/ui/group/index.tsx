"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Group as _Group } from "./basic";
import type { GroupProps } from "./types";

export const Group = createDynamicComponent<GroupProps>(
  "group",
  "Group",
  _Group,
  {},
);

export type { GroupProps };
