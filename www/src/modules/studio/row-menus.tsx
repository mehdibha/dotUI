"use client"

/* The picker's ⋯ menu on the user's systems. */

import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { Separator } from "@/registry/ui/separator"

import type { DesignSystemDoc } from "./workspace"

/** Touch-sized rows on phones. */
const item = "pointer-coarse:min-h-11"

export function SystemMenu({
  doc,
  onRename,
  onDuplicate,
  onDelete,
}: {
  doc: DesignSystemDoc
  onRename: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  return (
    <MenuContent
      aria-label={`Actions for ${doc.name}`}
      onAction={(key) => {
        if (key === "rename") onRename()
        if (key === "duplicate") onDuplicate()
        if (key === "delete") onDelete()
      }}
    >
      <MenuItem id="rename" className={item}>
        Rename…
      </MenuItem>
      <MenuItem id="duplicate" className={item}>
        Duplicate…
      </MenuItem>
      <Separator />
      <MenuItem id="delete" variant="danger" className={item}>
        Delete
      </MenuItem>
    </MenuContent>
  )
}
