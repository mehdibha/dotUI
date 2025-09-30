"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  Menu as _Menu,
  MenuContent as _MenuContent,
  MenuItem as _MenuItem,
  MenuRoot as _MenuRoot,
  MenuSection as _MenuSection,
  MenuSub as _MenuSub,
} from "./basic";
import type {
  MenuContentProps,
  MenuItemProps,
  MenuProps,
  MenuRootProps,
  MenuSectionProps,
  MenuSubProps,
} from "./basic";

export const MenuRoot = createDynamicComponent<MenuRootProps>(
  "menu",
  "MenuRoot",
  _MenuRoot,
  {},
);

export const Menu = <T extends object = object>(props: MenuProps<T>) => {
  const Component = createDynamicComponent<MenuProps<T>>(
    "menu",
    "Menu",
    _Menu,
    {},
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
    {},
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
    {},
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
    {},
  );

  return <Component {...props} />;
};

export const MenuSub = createDynamicComponent<MenuSubProps>(
  "menu",
  "MenuSub",
  _MenuSub,
  {},
);
