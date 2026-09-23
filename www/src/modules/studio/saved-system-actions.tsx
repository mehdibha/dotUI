"use client"

import { useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/ui/button"
import { DialogContent, DialogTitle } from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import { TextField } from "@/registry/ui/text-field"
import { docQuery } from "@/modules/studio/doc"
import { designOf } from "@/modules/studio/preset/saved-systems"
import type { SavedSystem } from "@/modules/studio/preset/saved-systems"

/**
 * The actions menu on a saved system's picker row: rename / duplicate / copy
 * link / delete. Lives on the row's trailing edge, so pressing it must not
 * apply the system — the menu button handles its own press.
 */
export function SavedSystemActions({
  saved,
  onRename,
  onDuplicate,
  onDelete,
}: {
  saved: SavedSystem
  onRename: (name: string) => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const { copyToClipboard } = useCopyToClipboard()
  const [renameOpen, setRenameOpen] = useState(false)

  function onAction(key: string) {
    if (key === "rename") setRenameOpen(true)
    else if (key === "duplicate") onDuplicate()
    else if (key === "copy") {
      // Record ids are this browser's: the link carries the name instead.
      const query = docQuery({ ...designOf(saved), name: saved.name })
      copyToClipboard(`${window.location.origin}/studio?${query}`)
    } else if (key === "delete") onDelete()
  }

  return (
    <>
      <Menu>
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label={`Actions for ${saved.name}`}
          className="shrink-0 text-fg-muted"
        >
          <MoreHorizontalIcon />
        </Button>
        <Popover placement="bottom end">
          <MenuContent onAction={(key) => onAction(String(key))}>
            <MenuItem id="rename">Rename</MenuItem>
            <MenuItem id="duplicate">Duplicate</MenuItem>
            <MenuItem id="copy">Copy link</MenuItem>
            <MenuItem id="delete" variant="danger">
              Delete
            </MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
      <RenameDialog
        isOpen={renameOpen}
        onOpenChange={setRenameOpen}
        currentName={saved.name}
        onRename={onRename}
      />
    </>
  )
}

/** Backs up and restores every saved system as a JSON file. */
export function SavedSystemsMenu({
  canExport,
  onExport,
  onImport,
}: {
  canExport: boolean
  onExport: () => void
  onImport: () => void
}) {
  return (
    <Menu>
      <Button
        variant="secondary"
        size="md"
        isIconOnly
        aria-label="Saved systems backup"
        className="mt-2 shrink-0"
      >
        <MoreHorizontalIcon />
      </Button>
      <Popover placement="bottom end">
        <MenuContent
          disabledKeys={canExport ? [] : ["export"]}
          onAction={(key) => (key === "export" ? onExport() : onImport())}
        >
          <MenuItem id="export">Export saved systems</MenuItem>
          <MenuItem id="import">Import saved systems…</MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}

function RenameDialog({
  isOpen,
  onOpenChange,
  currentName,
  onRename,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  onRename: (name: string) => void
}) {
  const [name, setName] = useState(currentName)
  // The field resets on every open (the modal stays mounted between opens).
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) setName(currentName)
  }

  function submit() {
    const trimmed = name.trim()
    if (trimmed) onRename(trimmed)
    onOpenChange(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-full sm:max-w-sm"
    >
      <DialogContent
        aria-label="Rename design system"
        className="flex flex-col gap-4"
      >
        <DialogTitle className="text-base font-semibold">
          Rename design system
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <TextField
            autoFocus
            aria-label="Name"
            value={name}
            onChange={setName}
          >
            <Label>Name</Label>
            <Input placeholder="My design system" />
          </TextField>
        </form>
        <div className="flex justify-end gap-2">
          <Button size="sm" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="primary"
            onPress={submit}
            isDisabled={!name.trim()}
          >
            Rename
          </Button>
        </div>
      </DialogContent>
    </Modal>
  )
}
