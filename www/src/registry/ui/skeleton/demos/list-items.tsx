'use client'

import { Skeleton } from '@/registry/ui/skeleton'

export default function Demo() {
  return (
    <Skeleton isLoading className="w-full max-w-xs space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="size-4 shrink-0 rounded" />
        </div>
      ))}
    </Skeleton>
  )
}
