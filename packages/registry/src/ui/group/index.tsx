"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { GroupProps } from "./types";

export const Group = createDynamicComponent<GroupProps>("group", "Group", Default.Group, {});

export type { GroupProps };
