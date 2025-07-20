"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Drawer as _Drawer } from "../registry/components/drawer/basic";
import type { DrawerProps } from "../registry/components/drawer/basic";

export const Drawer = createDynamicComponent("drawer", "Drawer", _Drawer, {
  basic: React.lazy(() =>
    import("../registry/components/drawer/basic").then((mod) => ({
      default: mod.Drawer,
    })),
  ),
});

export type { DrawerProps };
