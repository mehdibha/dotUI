"use client"

import { Marker, MarkerContent } from "@/registry/ui/marker"

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
    </div>
  )
}
