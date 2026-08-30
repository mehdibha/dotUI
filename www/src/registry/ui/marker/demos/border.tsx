"use client"

import { Marker, MarkerContent } from "@/registry/ui/marker"

export default function Demo() {
  return (
    <Marker variant="border" className="max-w-sm">
      <MarkerContent>Earlier this week</MarkerContent>
    </Marker>
  )
}
