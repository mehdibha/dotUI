"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type { TagGroupProps, TagListProps, TagProps } from "./types";

export const TagGroup = createDynamicComponent<TagGroupProps>(
  "tag-group",
  "TagGroup",
  Default.TagGroup,
  {},
);

export const TagList = <T extends object>(props: TagListProps<T>) => {
  const Component = createDynamicComponent<TagListProps<T>>(
    "tag-group",
    "TagList",
    Default.TagList,
    {},
  );

  return <Component {...props} />;
};

export const Tag = createDynamicComponent<TagProps>(
  "tag-group",
  "Tag",
  Default.Tag,
  {},
);

export type { TagGroupProps, TagProps };
