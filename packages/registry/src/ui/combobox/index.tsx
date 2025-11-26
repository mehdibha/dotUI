"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";
import {
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@dotui/registry/ui/list-box";

import {
  Combobox as _Combobox,
  ComboboxContent as _ComboboxContent,
  ComboboxInput as _ComboboxInput,
} from "./basic";
import type {
  ComboboxContentProps,
  ComboboxInputProps,
  ComboboxProps,
} from "./types";

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

export const ComboboxInput = createDynamicComponent<ComboboxInputProps>(
  "combobox",
  "ComboboxInput",
  _ComboboxInput,
  {},
);

export const ComboboxContent = <T extends object = object>(
  props: ComboboxContentProps<T>,
) => {
  const Component = createDynamicComponent<ComboboxContentProps<T>>(
    "combobox",
    "ComboboxContent",
    _ComboboxContent,
    {},
  );

  return <Component {...props} />;
};

export {
  ListBoxItem as ComboboxItem,
  ListBoxSection as ComboboxSection,
  ListBoxSectionHeader as ComboboxSectionHeader,
};

export type { ComboboxProps, ComboboxInputProps, ComboboxContentProps };
