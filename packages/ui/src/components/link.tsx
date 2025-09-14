"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Link as _Link } from "../registry/components/link/basic";
import type { LinkProps } from "../registry/components/link/basic";

export const Link = createDynamicComponent<LinkProps>(
  "link",
  "Link",
  _Link,
  {},
);

export type { LinkProps };
