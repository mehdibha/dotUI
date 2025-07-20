"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Tag as _Tag,
  TagGroup as _TagGroup,
} from "../registry/components/tag-group/basic";
import type {
  TagGroupProps,
  TagProps,
} from "../registry/components/tag-group/basic";

export const TagGroup = <T extends object = object>(
  props: TagGroupProps<T>,
) => {
  const Component = createDynamicComponent<TagGroupProps<T>>(
    "tag-group",
    "TagGroup",
    _TagGroup,
    {
      basic: React.lazy(() =>
        import("../registry/components/tag-group/basic").then((mod) => ({
          default: mod.TagGroup,
        })),
      ),
    },
  );

  return <Component {...props} />;
};

export const Tag = createDynamicComponent<TagProps>("tag-group", "Tag", _Tag, {
  basic: React.lazy(() =>
    import("../registry/components/tag-group/basic").then((mod) => ({
      default: mod.Tag,
    })),
  ),
});

export type { TagGroupProps, TagProps };
