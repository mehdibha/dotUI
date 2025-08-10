"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Skeleton as _Skeleton } from "../registry/components/skeleton/basic";
import type { SkeletonProps } from "../registry/components/skeleton/basic";

export const Skeleton = createDynamicComponent<SkeletonProps>(
  "skeleton",
  "Skeleton",
  _Skeleton,
  {},
);

export type { SkeletonProps };
