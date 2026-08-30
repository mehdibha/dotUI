"use client"

import { Marker, MarkerContent } from "@/registry/ui/marker"

export function MarkerDemo() {
  return (
    <div className="flex w-full max-w-3xs flex-col gap-4">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
    </div>
  )
}
