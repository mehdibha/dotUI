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

export const Combobox = <T extends object = object>(
  props: ComboboxProps<T>,
) => {
  const Component = createDynamicComponent<ComboboxProps<T>>(
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

  return <Component {...props} />;
};

export const ComboboxRoot = <T extends object = object>(
  props: ComboboxRootProps<T>,
) => {
  const Component = createDynamicComponent<ComboboxRootProps<T>>(
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

  return <Component {...props} />;
};

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

export const ComboboxItem = <T extends object = object>(
  props: ComboboxItemProps<T>,
) => {
  const Component = createDynamicComponent<ComboboxItemProps<T>>(
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

  return <Component {...props} />;
};

export type { ComboboxProps, ComboboxRootProps, ComboboxItemProps };
