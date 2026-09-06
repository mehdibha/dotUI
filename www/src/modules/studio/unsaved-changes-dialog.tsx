"use client"

import { Button } from "@/registry/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"

/**
 * Guards applying a preset over unsaved work — the one action that would
 * silently overwrite both the URL state and the persisted draft.
 */
export function UnsavedChangesDialog({
  isOpen,
  onOpenChange,
  onSave,
  onDiscard,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
  onDiscard: () => void
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-full sm:max-w-sm"
    >
      <DialogContent
        aria-label="Unsaved changes"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <DialogTitle className="text-base font-semibold">
            Unsaved changes
          </DialogTitle>
          <DialogDescription className="text-sm text-fg-muted">
            Applying this preset will replace your unsaved changes.
          </DialogDescription>
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="quiet" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onPress={onDiscard}>
            Discard
          </Button>
          <Button size="sm" variant="primary" onPress={onSave}>
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Modal>
  )
}
