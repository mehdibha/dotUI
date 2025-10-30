"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type {
  ListBoxItemProps,
  ListBoxSectionHeaderProps,
  ListBoxSectionProps,
} from "@dotui/registry/ui/list-box";

import type {
  SelectContentProps,
  SelectProps,
  SelectValueProps,
} from "./basic";
import {
  Select as _Select,
  SelectContent as _SelectContent,
  SelectItem as _SelectItem,
  SelectSection as _SelectSection,
  SelectSectionHeader as _SelectSectionHeader,
  SelectTrigger as _SelectTrigger,
  SelectValue as _SelectValue,
} from "./basic";

export const Select = <T extends object = object>(props: SelectProps<T>) => {
  const Component = createDynamicComponent<SelectProps<T>>(
    "select",
    "Select",
    _Select,
    {},
  );

  return <Component {...props} />;
};

export const SelectTrigger = createDynamicComponent<ButtonProps>(
  "select",
  "SelectTrigger",
  _SelectTrigger,
  {},
  true,
);

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

export const SelectContent = <T extends object = object>(
  props: SelectContentProps<T>,
) => {
  const Component = createDynamicComponent<SelectContentProps<T>>(
    "select",
    "SelectContent",
    _SelectContent,
    {},
  );
  return <Component {...props} />;
};

export const SelectItem = <T extends object = object>(
  props: ListBoxItemProps<T>,
) => {
  const Component = createDynamicComponent<ListBoxItemProps<T>>(
    "select",
    "SelectItem",
    _SelectItem,
    {},
  );

  return <Component {...props} />;
};

export const SelectSection = <T extends object = object>(
  props: ListBoxSectionProps<T>,
) => {
  const Component = createDynamicComponent<ListBoxSectionProps<T>>(
    "select",
    "SelectSection",
    _SelectSection,
    {},
  );
  return <Component {...props} />;
};

export const SelectSectionHeader =
  createDynamicComponent<ListBoxSectionHeaderProps>(
    "select",
    "SelectSectionHeader",
    _SelectSectionHeader,
    {},
  );

export type { SelectProps, SelectContentProps, SelectValueProps };
