"use client"

/* The picker's ⋯ menus: a row's actions by kind (presets and shared links
   can be copied; the user's systems renamed and deleted too) and the
   picker's own, which leads to Recently deleted. */

import {
  MenuContent,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
} from "@/registry/ui/menu"
import { toastManager } from "@/registry/ui/toast"
import { codeFlags } from "@/publisher/code-options"
import {
  buildInitCommands,
  packageManagerStore,
} from "@/modules/docs/install-commands"

import { getCodeOptions } from "./export/code-options-store"
import { viewLink } from "./selection"
import type { ViewSelection } from "./selection"
import { useUnpublishedChanges } from "./workspace"
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

function installCommand(presetId: string): string {
  const flags = codeFlags(getCodeOptions())
  const url = `${window.location.origin}/r/p/${presetId}/init.json${flags ? `?code=${flags}` : ""}`
  return buildInitCommands(url)[packageManagerStore.get()]
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
          copy(installCommand(sel.id), "Install command")
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
 *  and never publishes. */
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
  const last = doc.published.at(-1)
  const unpublished = useUnpublishedChanges(doc)
  return (
    <MenuContent
      aria-label={`Actions for ${doc.name}`}
      onAction={(key) => {
        if (key === "rename") onRename()
        if (key === "duplicate") onDuplicate()
        if (key === "link" && last)
          copy(`${window.location.origin}/studio?s=${last.id}`, "Link")
        if (key === "delete") onDelete()
      }}
    >
      <MenuSection>
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
        <MenuItem
          id="link"
          isDisabled={!last}
          textValue={
            unpublished && last ? "Copy last published link" : "Copy link"
          }
        >
          <MenuItemLabel>
            {unpublished && last ? "Copy last published link" : "Copy link"}
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
