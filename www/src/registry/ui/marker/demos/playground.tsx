"use client"

import { Marker, MarkerContent, type MarkerProps } from "@/registry/ui/marker"

export default function Demo({
  label = "Today",
  variant = "default",
}: {
  label?: string
  variant?: MarkerProps["variant"]
} = {}) {
  return (
    <Marker variant={variant} className="max-w-sm">
      {label && <MarkerContent>{label}</MarkerContent>}
    </Marker>
  )
}
