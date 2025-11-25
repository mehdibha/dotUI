"use client";

import type { Control } from "@dotui/registry/playground";

import { Skeleton, SkeletonProvider } from "../index";

interface SkeletonPlaygroundProps {
  isLoading?: boolean;
}

export function SkeletonPlayground({
  isLoading = true,
}: SkeletonPlaygroundProps) {
  return (
    <SkeletonProvider isLoading={isLoading}>
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </SkeletonProvider>
  );
}

export const skeletonControls: Control[] = [
  {
    type: "boolean",
    name: "isLoading",
    label: "Loading",
    defaultValue: true,
  },
];

