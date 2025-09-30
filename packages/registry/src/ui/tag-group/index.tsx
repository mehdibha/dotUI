"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { Tag as _Tag, TagGroup as _TagGroup } from "./basic";
import type { TagGroupProps, TagProps } from "./basic";

export const TagGroup = <T extends object = object>(
  props: TagGroupProps<T>,
) => {
  const Component = createDynamicComponent<TagGroupProps<T>>(
    "tag-group",
    "TagGroup",
    _TagGroup,
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
