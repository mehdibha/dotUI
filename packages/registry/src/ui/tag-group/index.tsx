"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Tag as _Tag,
  TagGroup as _TagGroup,
  TagList as _TagList,
} from "./basic";
import type { TagGroupProps, TagListProps, TagProps } from "./types";

export const TagGroup = createDynamicComponent<TagGroupProps>(
  "tag-group",
  "TagGroup",
  _TagGroup,
  {},
);

export const TagList = <T extends object>(props: TagListProps<T>) => {
  const Component = createDynamicComponent<TagListProps<T>>(
    "tag-group",
    "TagList",
    _TagList,
    {},
  );

  return <Component {...props} />;
};

export const Tag = createDynamicComponent<TagProps>(
  "tag-group",
  "Tag",
  _Tag,
  {},
);

export type { TagGroupProps, TagProps };
