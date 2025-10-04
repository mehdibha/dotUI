"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";
import { Button } from "@dotui/registry/ui/button";
import { ListBox } from "@dotui/registry/ui/list-box";
import { Overlay } from "@dotui/registry/ui/overlay";

import {
  Select as _Select,
  SelectItem as _SelectItem,
  SelectRoot as _SelectRoot,
  SelectValue as _SelectValue,
} from "./basic";
import type {
  SelectItemProps,
  SelectProps,
  SelectRootProps,
  SelectValueProps,
} from "./basic";

export const SelectRoot = <T extends object = object>(
  props: SelectRootProps<T>,
) => {
  const Component = createDynamicComponent<SelectRootProps<T>>(
    "select",
    "SelectRoot",
    _SelectRoot,
    {},
  );

  return <Component {...props} />;
};

export const SelectBase = <T extends object = object>(
  props: SelectProps<T>,
) => {
  const Component = createDynamicComponent<SelectProps<T>>(
    "select",
    "Select",
    _Select,
    {},
    true,
  );

  return <Component {...props} />;
};

export const SelectValue = <T extends object = object>(
  props: SelectValueProps<T>,
) => {
  const Component = createDynamicComponent<SelectValueProps<T>>(
    "select",
    "SelectValue",
    _SelectValue,
    {},
  );

  return <Component {...props} />;
};

export const SelectItem = <T extends object = object>(
  props: SelectItemProps<T>,
) => {
  const Component = createDynamicComponent<SelectItemProps<T>>(
    "select",
    "SelectItem",
    _SelectItem,
    {},
  );

  return <Component {...props} />;
};

export const Select = Object.assign(SelectBase, {
  Root: SelectRoot,
  Value: SelectValue,
  Item: SelectItem,
  ListBox,
  Overlay,
  Button,
});

export type { SelectProps, SelectRootProps, SelectValueProps, SelectItemProps };
