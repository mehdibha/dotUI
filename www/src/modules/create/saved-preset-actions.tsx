'use client'

import { useState } from 'react'
import { MoreHorizontalIcon } from 'lucide-react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { Button } from '@/registry/ui/button'
import { DialogContent, DialogTitle } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Modal } from '@/registry/ui/modal'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'
import type { SavedPreset } from '@/modules/create/preset'

/**
 * The actions menu on a saved preset's picker row: rename / duplicate / copy
 * link / delete. Lives on the row's trailing edge, so pressing it must not
 * apply the preset — the menu button handles its own press.
 */
export function SavedPresetActions({
  saved,
  onRename,
  onDuplicate,
  onDelete,
}: {
  saved: SavedPreset
  onRename: (name: string) => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const { copyToClipboard } = useCopyToClipboard()
  const [renameOpen, setRenameOpen] = useState(false)

  function onAction(key: string) {
    if (key === 'rename') setRenameOpen(true)
    else if (key === 'duplicate') onDuplicate()
    else if (key === 'copy') {
      copyToClipboard(`${window.location.origin}/create?preset=${saved.state}`)
    } else if (key === 'delete') onDelete()
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
      <RenamePresetDialog
        isOpen={renameOpen}
        onOpenChange={setRenameOpen}
        currentName={saved.name}
        onRename={onRename}
      />
    </>
  )
}

function RenamePresetDialog({
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

  function submit() {
    const trimmed = name.trim()
    if (trimmed) onRename(trimmed)
    onOpenChange(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (open) setName(currentName)
        onOpenChange(open)
      }}
      className="w-full sm:max-w-sm"
    >
      <DialogContent aria-label="Rename preset" className="flex flex-col gap-4">
        <DialogTitle className="text-base font-semibold">
          Rename preset
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <TextField
            autoFocus
            aria-label="Preset name"
            value={name}
            onChange={setName}
          >
            <Label>Name</Label>
            <Input placeholder="Untitled" />
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
