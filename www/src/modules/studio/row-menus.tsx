"use client"

/* The picker's ⋯ menu on the user's rows. */

import { Fragment } from "react"

import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { Separator } from "@/registry/ui/separator"

export interface RowAction {
  label: string
  /** Destructive: last, under a separator. */
  danger?: boolean
  run: () => void
}

export function RowMenu({
  name,
  actions,
}: {
  name: string
  actions: RowAction[]
}) {
  return (
    <MenuContent
      aria-label={`Actions for ${name}`}
      onAction={(key) => actions[Number(key)]?.run()}
    >
      {actions.map(({ label, danger }, index) => (
        <Fragment key={label}>
          {danger && <Separator />}
          <MenuItem
            id={index}
            variant={danger ? "danger" : undefined}
            // Touch-sized rows on phones.
            className="pointer-coarse:min-h-11"
          >
            {label}
          </MenuItem>
        </Fragment>
      ))}
    </MenuContent>
  )
}
