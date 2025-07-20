"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Combobox as _Combobox,
  ComboboxInput as _ComboboxInput,
  ComboboxItem as _ComboboxItem,
  ComboboxRoot as _ComboboxRoot,
} from "../registry/components/combobox/basic";
import type {
  ComboboxItemProps,
  ComboboxProps,
  ComboboxRootProps,
} from "../registry/components/combobox/basic";

export const Combobox = createDynamicComponent<ComboboxProps<object>>(
  "combobox",
  "Combobox",
  _Combobox,
  {
    basic: React.lazy(() =>
      import("../registry/components/combobox/basic").then((mod) => ({
        default: mod.Combobox,
      })),
    ),
  },
);

export const ComboboxRoot = createDynamicComponent<ComboboxRootProps<object>>(
  "combobox",
  "ComboboxRoot",
  _ComboboxRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/combobox/basic").then((mod) => ({
        default: mod.ComboboxRoot,
      })),
    ),
  },
);

export const ComboboxInput = createDynamicComponent(
  "combobox",
  "ComboboxInput",
  _ComboboxInput,
  {
    basic: React.lazy(() =>
      import("../registry/components/combobox/basic").then((mod) => ({
        default: mod.ComboboxInput,
      })),
    ),
  },
);

export const ComboboxItem = createDynamicComponent<ComboboxItemProps<object>>(
  "combobox",
  "ComboboxItem",
  _ComboboxItem,
  {
    basic: React.lazy(() =>
      import("../registry/components/combobox/basic").then((mod) => ({
        default: mod.ComboboxItem,
      })),
    ),
  },
);

export type { ComboboxProps, ComboboxRootProps, ComboboxItemProps };
