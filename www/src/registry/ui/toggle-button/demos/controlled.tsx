"use client"

import React from "react"

import { PinIcon } from "@/registry/__generated__/icons"
import { ToggleButton } from "@/registry/ui/toggle-button"

export default function Demo() {
  const [isSelected, setSelected] = React.useState(true)
  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleButton isSelected={isSelected} onChange={setSelected}>
        <PinIcon data-icon="inline-start" className="rotate-45" />
        Pin
      </ToggleButton>
      <span className="text-sm text-fg-muted">
        {isSelected ? "Pinned" : "Not pinned"}
      </span>
    </div>
  )
}
