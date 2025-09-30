"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { Drawer as _Drawer } from "./basic";
import type { DrawerProps } from "./basic";

export const Drawer = createDynamicComponent("drawer", "Drawer", _Drawer, {});

export type { DrawerProps };
