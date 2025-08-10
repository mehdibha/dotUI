"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Drawer as _Drawer } from "../registry/components/drawer/basic";
import type { DrawerProps } from "../registry/components/drawer/basic";

export const Drawer = createDynamicComponent("drawer", "Drawer", _Drawer, {});

export type { DrawerProps };
