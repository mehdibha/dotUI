"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Menu as _Menu,
  MenuContent as _MenuContent,
  MenuItem as _MenuItem,
  MenuRoot as _MenuRoot,
  MenuSection as _MenuSection,
  MenuSub as _MenuSub,
} from "../registry/components/menu/basic";
import type {
  MenuContentProps,
  MenuItemProps,
  MenuProps,
  MenuRootProps,
  MenuSectionProps,
  MenuSubProps,
} from "../registry/components/menu/basic";

export const MenuRoot = createDynamicComponent<MenuRootProps>(
  "menu",
  "MenuRoot",
  _MenuRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/menu/basic").then((mod) => ({
        default: mod.MenuRoot,
      })),
    ),
  },
);

export const Menu = createDynamicComponent<MenuProps<object>>(
  "menu",
  "Menu",
  _Menu,
  {
    basic: React.lazy(() =>
      import("../registry/components/menu/basic").then((mod) => ({
        default: mod.Menu,
      })),
    ),
  },
);

export const MenuContent = createDynamicComponent<MenuContentProps<object>>(
  "menu",
  "MenuContent",
  _MenuContent,
  {
    basic: React.lazy(() =>
      import("../registry/components/menu/basic").then((mod) => ({
        default: mod.MenuContent,
      })),
    ),
  },
);

export const MenuItem = createDynamicComponent<MenuItemProps<object>>(
  "menu",
  "MenuItem",
  _MenuItem,
  {
    basic: React.lazy(() =>
      import("../registry/components/menu/basic").then((mod) => ({
        default: mod.MenuItem,
      })),
    ),
  },
);

export const MenuSection = createDynamicComponent<MenuSectionProps<object>>(
  "menu",
  "MenuSection",
  _MenuSection,
  {
    basic: React.lazy(() =>
      import("../registry/components/menu/basic").then((mod) => ({
        default: mod.MenuSection,
      })),
    ),
  },
);

export const MenuSub = createDynamicComponent<MenuSubProps>(
  "menu",
  "MenuSub",
  _MenuSub,
  {
    basic: React.lazy(() =>
      import("../registry/components/menu/basic").then((mod) => ({
        default: mod.MenuSub,
      })),
    ),
  },
);
