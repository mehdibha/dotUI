"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  ListBox as _ListBox,
  ListBoxItem as _ListBoxItem,
  ListBoxSection as _ListBoxSection,
} from "../registry/components/list-box/basic";
import type {
  ListBoxItemProps,
  ListBoxProps,
  ListBoxSectionProps,
} from "../registry/components/list-box/basic";

export const ListBox = <T extends object = object>(props: ListBoxProps<T>) => {
  const Component = createDynamicComponent<ListBoxProps<T>>(
    "list-box",
    "ListBox",
    _ListBox,
    {},
  );

  return <Component {...props} />;
};

export const ListBoxItem = <T extends object = object>(
  props: ListBoxItemProps<T>,
) => {
  const Component = createDynamicComponent<ListBoxItemProps<T>>(
    "list-box",
    "ListBoxItem",
    _ListBoxItem,
    {},
  );

  return <Component {...props} />;
};

export const ListBoxSection = <T extends object = object>(
  props: ListBoxSectionProps<T>,
) => {
  const Component = createDynamicComponent<ListBoxSectionProps<T>>(
    "list-box",
    "ListBoxSection",
    _ListBoxSection,
    {},
  );

  return <Component {...props} />;
};

export type { ListBoxProps, ListBoxItemProps, ListBoxSectionProps };
