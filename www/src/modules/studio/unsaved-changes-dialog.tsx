"use client"

import { Button } from "@/registry/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"

/**
 * Guards replacing unsaved work (applying a preset, resetting) — the actions
 * that would silently overwrite both the URL state and the persisted draft.
 */
export function UnsavedChangesDialog({
  isOpen,
  onOpenChange,
  onSave,
  onDiscard,
  title = "Unsaved changes",
  description = "Applying this design system will replace your unsaved changes.",
}: {
  title?: string
  description?: string
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
      <DialogContent aria-label={title} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-fg-muted">
            {description}
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
