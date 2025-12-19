"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type { DrawerProps } from "./types";

export const Drawer = createDynamicComponent("drawer", "Drawer", Default.Drawer, {});

export type { DrawerProps };
