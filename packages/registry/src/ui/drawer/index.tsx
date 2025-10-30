"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { DrawerProps } from "./basic";
import { Drawer as _Drawer } from "./basic";

export const Drawer = createDynamicComponent("drawer", "Drawer", _Drawer, {});

export type { DrawerProps };
