"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { DrawerProps } from "./types";

export const Drawer = createDynamicComponent(
  "drawer",
  "Drawer",
  Default.Drawer,
  {},
);

export type { DrawerProps };
