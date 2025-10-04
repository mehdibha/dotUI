"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Skeleton as _Skeleton } from "./basic";
import type { SkeletonProps } from "./basic";

export const Skeleton = createDynamicComponent<SkeletonProps>(
  "skeleton",
  "Skeleton",
  _Skeleton,
  {},
);

export type { SkeletonProps };
