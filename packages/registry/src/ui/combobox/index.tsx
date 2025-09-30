"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  Combobox as _Combobox,
  ComboboxInput as _ComboboxInput,
  ComboboxItem as _ComboboxItem,
  ComboboxRoot as _ComboboxRoot,
} from "./basic";
import type {
  ComboboxItemProps,
  ComboboxProps,
  ComboboxRootProps,
} from "./basic";

export const Combobox = <T extends object = object>(
  props: ComboboxProps<T>,
) => {
  const Component = createDynamicComponent<ComboboxProps<T>>(
    "combobox",
    "Combobox",
    _Combobox,
    {},
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
    {},
  );

  return <Component {...props} />;
};

export const ComboboxInput = createDynamicComponent(
  "combobox",
  "ComboboxInput",
  _ComboboxInput,
  {},
);

export const ComboboxItem = <T extends object = object>(
  props: ComboboxItemProps<T>,
) => {
  const Component = createDynamicComponent<ComboboxItemProps<T>>(
    "combobox",
    "ComboboxItem",
    _ComboboxItem,
    {},
  );

  return <Component {...props} />;
};
export type { ComboboxProps, ComboboxRootProps, ComboboxItemProps };
