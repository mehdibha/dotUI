"use client"

import { Marker, MarkerContent, type MarkerProps } from "@/registry/ui/marker"

export default function Demo({
  label = "Today",
  variant = "separator",
}: {
  label?: string
  variant?: MarkerProps["variant"]
} = {}) {
  return (
    <Marker variant={variant} className="max-w-sm justify-center">
      {label && <MarkerContent>{label}</MarkerContent>}
    </Marker>
  )
}
