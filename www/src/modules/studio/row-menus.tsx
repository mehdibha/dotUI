"use client"

/* The picker's ⋯ menus: a row's actions by kind (presets and shared links
   can be copied; the user's systems renamed and deleted too) and the
   picker's own, which leads to Recently deleted. */

import { Kbd } from "@/registry/ui/kbd"
import {
  MenuContent,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
} from "@/registry/ui/menu"
import { toastManager } from "@/registry/ui/toast"

import { initCommand, snapshotLink } from "./publish"
import { viewLink } from "./selection"
import type { ViewSelection } from "./selection"
import { usePublishStatus } from "./workspace"
import type { DesignSystemDoc } from "./workspace"

function copy(text: string, what: string) {
  navigator.clipboard.writeText(text).then(
    () => toastManager.add({ title: `${what} copied` }),
    (error: unknown) => {
      console.error(error)
      toastManager.add({
        title: `Couldn't copy the ${what.toLowerCase()}`,
        type: "error",
      })
    },
  )
}

/** A preset's or a shared link's menu. */
export function ViewMenu({
  sel,
  onDuplicate,
}: {
  sel: ViewSelection
  onDuplicate: () => void
}) {
  return (
    <MenuContent
      aria-label="Design system actions"
      onAction={(key) => {
        if (key === "duplicate") onDuplicate()
        if (key === "link") copy(viewLink(sel), "Link")
        if (key === "install" && sel.kind === "preset")
          copy(initCommand(`p/${sel.id}`), "Install command")
      }}
    >
      <MenuItem id="duplicate">Duplicate</MenuItem>
      <MenuItem id="link">Copy link</MenuItem>
      {sel.kind === "preset" && (
        <MenuItem id="install">Copy install command</MenuItem>
      )}
    </MenuContent>
  )
}

/** One of the user's systems: Copy link copies its latest published link,
 *  and never publishes. F2 renames the current one. */
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
  const last = doc.published.at(-1)
  const unpublished = usePublishStatus(doc) === "changed"
  return (
    <MenuContent
      aria-label={`Actions for ${doc.name}`}
      onAction={(key) => {
        if (key === "rename") onRename()
        if (key === "duplicate") onDuplicate()
        if (key === "link" && last) copy(snapshotLink(last.id), "Link")
        if (key === "delete") onDelete()
      }}
    >
      <MenuSection>
        <MenuItem id="rename" textValue="Rename">
          <MenuItemLabel>Rename</MenuItemLabel>
          {isCurrent && <Kbd>F2</Kbd>}
        </MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
        <MenuItem
          id="link"
          isDisabled={!last}
          textValue={unpublished ? "Copy last published link" : "Copy link"}
        >
          <MenuItemLabel>
            {unpublished ? "Copy last published link" : "Copy link"}
          </MenuItemLabel>
          {!last && (
            <MenuItemDescription>Not published yet</MenuItemDescription>
          )}
        </MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuItem id="delete" variant="danger">
          Delete
        </MenuItem>
      </MenuSection>
    </MenuContent>
  )
}
