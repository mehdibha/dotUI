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

export const Menu = <T extends object = object>(props: MenuProps<T>) => {
  const Component = createDynamicComponent<MenuProps<T>>(
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

  return <Component {...props} />;
};

export const MenuContent = <T extends object = object>(
  props: MenuContentProps<T>,
) => {
  const Component = createDynamicComponent<MenuContentProps<T>>(
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

  return <Component {...props} />;
};

export const MenuItem = <T extends object = object>(
  props: MenuItemProps<T>,
) => {
  const Component = createDynamicComponent<MenuItemProps<T>>(
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

  return <Component {...props} />;
};

export const MenuSection = <T extends object = object>(
  props: MenuSectionProps<T>,
) => {
  const Component = createDynamicComponent<MenuSectionProps<T>>(
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

  return <Component {...props} />;
};

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
