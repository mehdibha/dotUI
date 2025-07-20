"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Select as _Select,
  SelectItem as _SelectItem,
  SelectRoot as _SelectRoot,
  SelectValue as _SelectValue,
} from "../registry/components/select/basic";
import type {
  SelectItemProps,
  SelectProps,
  SelectRootProps,
  SelectValueProps,
} from "../registry/components/select/basic";

export const SelectRoot = <T extends object = object>(
  props: SelectRootProps<T>,
) => {
  const Component = createDynamicComponent<SelectRootProps<T>>(
    "select",
    "SelectRoot",
    _SelectRoot,
    {
      basic: React.lazy(() =>
        import("../registry/components/select/basic").then((mod) => ({
          default: mod.SelectRoot,
        })),
      ),
    },
  );

  return <Component {...props} />;
};

export const Select = <T extends object = object>(props: SelectProps<T>) => {
  const Component = createDynamicComponent<SelectProps<T>>(
    "select",
    "Select",
    _Select,
    {
      basic: React.lazy(() =>
        import("../registry/components/select/basic").then((mod) => ({
          default: mod.Select,
        })),
      ),
    },
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
    {
      basic: React.lazy(() =>
        import("../registry/components/select/basic").then((mod) => ({
          default: mod.SelectValue,
        })),
      ),
    },
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
    {
      basic: React.lazy(() =>
        import("../registry/components/select/basic").then((mod) => ({
          default: mod.SelectItem,
        })),
      ),
    },
  );

  return <Component {...props} />;
};

export type { SelectProps, SelectRootProps, SelectValueProps, SelectItemProps };