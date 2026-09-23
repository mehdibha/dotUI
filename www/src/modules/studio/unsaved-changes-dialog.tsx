"use client"

import { Button } from "@/registry/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"

/**
 * Guards replacing unsaved work (applying a preset, creating one, Reset).
 * Names what the work is and where Save puts it.
 */
export function UnsavedChangesDialog({
  isOpen,
  onOpenChange,
  subject,
  saveLabel,
  onSave,
  onDiscard,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  /** The document with the unsaved work. */
  subject: string
  saveLabel: string
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
            This replaces your unsaved changes to {subject}.
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
            {saveLabel}
          </Button>
        </div>
      </DialogContent>
    </Modal>
  )
}
