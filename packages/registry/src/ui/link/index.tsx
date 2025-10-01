"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Link as _Link } from "./basic";
import type { LinkProps } from "./basic";

export const Link = createDynamicComponent<LinkProps>(
  "link",
  "Link",
  _Link,
  {},
);

export type { LinkProps };
