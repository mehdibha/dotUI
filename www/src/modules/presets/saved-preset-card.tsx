'use client'

import { useMemo, useState } from 'react'
import { MoreHorizontalIcon } from 'lucide-react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { DialogContent, DialogTitle } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Modal } from '@/registry/ui/modal'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'
import { ShowcaseCard } from '@/components/showcase-card'
import { decodePreset, type SavedPreset } from '@/modules/create/preset'

import { PresetThumbnail } from './preset-thumbnail'

/**
 * A user-saved preset in the gallery — the same framed live preview as a
 * built-in card, plus an actions menu (rename / duplicate / copy link / delete)
 * in the header slot and an accent ring when it's the active preset.
 */
export function SavedPresetCard({
  saved,
  isActive,
  onApply,
  onRename,
  onDuplicate,
  onDelete,
}: {
  saved: SavedPreset
  isActive: boolean
  onApply: () => void
  onRename: (name: string) => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const designSystem = useMemo(() => decodePreset(saved.state), [saved.state])
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
      <ShowcaseCard
        label={saved.name}
        action={
          <Menu>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label={`Actions for ${saved.name}`}
              className="-my-1"
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
        }
        className={cn(
          'transition hover:border-border-hover hover:shadow-md has-[button:focus-visible]:border-border-hover',
          isActive && 'ring-2 ring-border-focus ring-offset-2 ring-offset-bg',
        )}
      >
        <PresetThumbnail designSystem={designSystem} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
        <button
          type="button"
          onClick={onApply}
          aria-label={`Apply the ${saved.name} preset`}
          className="absolute inset-0 z-10 rounded-2xl focus-visible:focus-ring"
        />
      </ShowcaseCard>
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
