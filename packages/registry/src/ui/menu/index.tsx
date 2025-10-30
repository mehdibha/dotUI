"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  MenuContentProps,
  MenuItemProps,
  MenuProps,
  MenuSectionHeaderProps,
  MenuSectionProps,
  MenuSubProps,
} from "./basic";
import {
  Menu as _Menu,
  MenuContent as _MenuContent,
  MenuItem as _MenuItem,
  MenuSection as _MenuSection,
  MenuSectionHeader as _MenuSectionHeader,
  MenuSub as _MenuSub,
} from "./basic";

export const Menu = createDynamicComponent<MenuProps>(
  "menu",
  "Menu",
  _Menu,
  {},
);

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

export const MenuSectionHeader = createDynamicComponent<MenuSectionHeaderProps>(
  "menu",
  "MenuSectionHeader",
  _MenuSectionHeader,
  {},
);

export const MenuSub = createDynamicComponent<MenuSubProps>(
  "menu",
  "MenuSub",
  _MenuSub,
  {},
);
