"use client"

/* The picker's ⋯ menu on the user's systems. */

import { Kbd } from "@/registry/ui/kbd"
import { MenuContent, MenuItem, MenuItemLabel } from "@/registry/ui/menu"
import { Separator } from "@/registry/ui/separator"

import type { DesignSystemDoc } from "./workspace"

/** Touch-sized rows on phones. */
const item = "pointer-coarse:min-h-11"

/** One of the user's systems. F2 renames the current one. */
export function SystemMenu({
  doc,
  isCurrent,
  onRename,
  onDuplicate,
  onDelete,
}: {
  doc: DesignSystemDoc
  isCurrent: boolean
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
      <MenuItem id="rename" textValue="Rename" className={item}>
        <MenuItemLabel>Rename</MenuItemLabel>
        {isCurrent && <Kbd className="pointer-coarse:hidden">F2</Kbd>}
      </MenuItem>
      <MenuItem id="duplicate" className={item}>
        Duplicate
      </MenuItem>
      <Separator />
      <MenuItem id="delete" variant="danger" className={item}>
        Delete
      </MenuItem>
    </MenuContent>
  )
}
