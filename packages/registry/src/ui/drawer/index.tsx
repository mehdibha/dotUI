"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Drawer as _Drawer } from "./basic";
import type { DrawerProps } from "./basic";

export const Drawer = createDynamicComponent("drawer", "Drawer", _Drawer, {});

export type { DrawerProps };
