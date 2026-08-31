"use client"

import { BellIcon } from "@/registry/icons"
import { Marker, MarkerContent, MarkerIcon } from "@/registry/ui/marker"

export default function Demo() {
  return (
    <Marker className="max-w-sm">
      <MarkerIcon>
        <BellIcon />
      </MarkerIcon>
      <MarkerContent>3 unread messages</MarkerContent>
    </Marker>
  )
}
