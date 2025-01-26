"use client";

import { createDynamicComponent } from "@/lib/create-dynamic-component";
import { Drawer as _Drawer, DrawerProps } from "@/registry/core/drawer_basic";

export const Drawer = createDynamicComponent<DrawerProps>(
  "drawer",
  "Drawer",
  _Drawer,
  {}
);
