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

export const SelectRoot = createDynamicComponent<SelectRootProps<object>>(
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

export const Select = createDynamicComponent<SelectProps<object>>(
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

export const SelectValue = createDynamicComponent<SelectValueProps<object>>(
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

export const SelectItem = createDynamicComponent<SelectItemProps<object>>(
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

