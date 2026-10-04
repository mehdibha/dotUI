"use client"

/* Confirms deleting one of the user's design systems. */

import { useState } from "react"

import { Button } from "@/registry/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"

import type { DesignSystemDoc } from "./workspace"

export function DeleteDialog({
  system,
  onDelete,
  onClose,
}: {
  system?: DesignSystemDoc
  onDelete: (id: string) => void
  onClose: () => void
}) {
  // Still shown while the dialog animates out.
  const [shown, setShown] = useState(system)
  if (system && system !== shown) setShown(system)
  return (
    // Not dismissed by a press outside: a double click's second press on
    // what opened it lands there.
    <Modal
      isOpen={!!system}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      isDismissable={false}
      className="sm:max-w-sm"
    >
      <DialogContent role="alertdialog">
        <DialogHeader>
          <DialogTitle>Delete design system?</DialogTitle>
          <DialogDescription>
            <span dir="auto" className="font-medium text-fg">
              {shown?.name}
            </span>{" "}
            will be deleted from this browser. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button slot="close">Cancel</Button>
          <Button
            variant="danger"
            onPress={() => {
              onClose()
              if (shown) onDelete(shown.id)
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Modal>
  )
}
