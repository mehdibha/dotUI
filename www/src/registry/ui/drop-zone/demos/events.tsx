"use client"

import React from "react"
import { useDrag } from "react-aria"
import type { TextDropItem } from "react-aria-components/useDragAndDrop"

import { DropZone, DropZoneLabel } from "@/registry/ui/drop-zone"

export default function Demo() {
  const [dropped, setDropped] = React.useState<string | null>(null)
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col gap-4">
        <Draggable text="Component A" />
        <Draggable text="Component B" />
      </div>
      <DropZone
        onDrop={async (e) => {
          const items = await Promise.all(
            e.items
              .filter(
                (item) => item.kind === "text" && item.types.has("text/plain"),
              )
              .map((item) => (item as TextDropItem).getText("text/plain")),
          )
          setDropped(items.join(", "))
        }}
      >
        <DropZoneLabel>
          {dropped ? `You dropped ${dropped}` : "Droppable"}
        </DropZoneLabel>
      </DropZone>
    </div>
  )
}

const Draggable = ({ text }: { text: string }) => {
  const { dragProps, isDragging } = useDrag({
    getItems() {
      return [
        {
          "text/plain": text,
        },
      ]
    },
  })

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        {...dragProps}
        type="button"
        data-dragging={isDragging || undefined}
        className="rounded-sm border bg-muted p-2 transition-all hover:scale-105 dragging:opacity-50"
      >
        {text}
      </button>
      <span className="text-xs text-fg-muted">Drag me</span>
    </div>
  )
}
