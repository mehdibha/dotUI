"use client";

import type { TextDropItem } from "react-aria-components";
import React from "react";
import { DropZone, DropZoneLabel } from "@/components/dynamic-ui/drop-zone";
import { useDrag } from "react-aria";

export default function Demo() {
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
          );
          alert(`You dropped ${items.join("\n")}`);
        }}
      >
        <DropZoneLabel>Droppable</DropZoneLabel>
      </DropZone>
    </div>
  );
}

const Draggable = ({ text }: { text: string }) => {
  const { dragProps, isDragging } = useDrag({
    getItems() {
      return [
        {
          "text/plain": text,
        },
      ];
    },
  });

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        {...dragProps}
        role="button"
        data-dragging={isDragging || undefined}
        tabIndex={0}
        className="bg-bg-muted rounded-sm border p-2 transition-all hover:scale-105 data-dragging:opacity-50"
      >
        {text}
      </div>
      <span className="text-fg-muted text-xs">Drag me</span>
    </div>
  );
};
