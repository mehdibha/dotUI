"use client";

import React from "react";

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

export const ListBox = createDynamicComponent<ListBoxProps<object>>(
  "list-box",
  "ListBox",
  _ListBox,
  {
    basic: React.lazy(() =>
      import("../registry/components/list-box/basic").then((mod) => ({
        default: mod.ListBox,
      })),
    ),
  },
);

export const ListBoxItem = createDynamicComponent<ListBoxItemProps<object>>(
  "list-box",
  "ListBoxItem",
  _ListBoxItem,
  {
    basic: React.lazy(() =>
      import("../registry/components/list-box/basic").then((mod) => ({
        default: mod.ListBoxItem,
      })),
    ),
  },
);

export const ListBoxSection = createDynamicComponent<
  ListBoxSectionProps<object>
>("list-box", "ListBoxSection", _ListBoxSection, {
  basic: React.lazy(() =>
    import("../registry/components/list-box/basic").then((mod) => ({
      default: mod.ListBoxSection,
    })),
  ),
});

export type { ListBoxProps, ListBoxItemProps, ListBoxSectionProps };
