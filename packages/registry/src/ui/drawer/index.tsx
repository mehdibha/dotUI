"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type { DrawerProps } from "./types";

export const Drawer = createDynamicComponent("drawer", "Drawer", Default.Drawer, {});

export type { DrawerProps };
