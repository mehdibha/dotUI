"use client";

import { Skeleton } from "@dotui/registry-v2/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="space-y-2">
        <Skeleton show={false}>
          <p>This text is visible when show is false</p>
        </Skeleton>
        <Skeleton show={true}>
          <p>This text is hidden when show is true</p>
        </Skeleton>
      </div>
    </div>
  );
}
