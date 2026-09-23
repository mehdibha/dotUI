"use client"

import { useState } from "react"

import { Button } from "@/registry/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import { TextField } from "@/registry/ui/text-field"

/**
 * Saves the document. A tab editing a saved system first offers to update it
 * in place, which never renames; "Save as new" owns the name field.
 */
export function SavePresetDialog({
  isOpen,
  onOpenChange,
  defaultName,
  updateTarget,
  onSaveNew,
  onUpdate,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  defaultName: string
  /** The saved system Update writes to. */
  updateTarget?: string
  onSaveNew: (name: string) => void
  onUpdate: () => void
}) {
  const [name, setName] = useState(defaultName)
  const [naming, setNaming] = useState(!updateTarget)
  // Each open starts over (the modal stays mounted between opens).
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) {
      setName(defaultName)
      setNaming(!updateTarget)
    }
  }

  const trimmed = name.trim()

  function saveNew() {
    if (!trimmed) return
    onSaveNew(trimmed)
    onOpenChange(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-full sm:max-w-sm"
    >
      <DialogContent
        aria-label="Save design system"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <DialogTitle className="text-base font-semibold">
            Save design system
          </DialogTitle>
          <DialogDescription className="text-sm text-fg-muted">
            {naming
              ? "Store the current design system under a name you can come back to."
              : `Save your changes to “${updateTarget}”, or keep them as a new design system.`}
          </DialogDescription>
        </div>
        {naming ? (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveNew()
              }}
            >
              <TextField
                autoFocus
                aria-label="Name"
                value={name}
                onChange={setName}
              >
                <Label>Name</Label>
                <Input
                  placeholder="My design system"
                  onFocus={(e) => e.currentTarget.select()}
                />
              </TextField>
            </form>
            <div className="flex justify-end gap-2">
              <Button size="sm" onPress={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onPress={saveNew}
                isDisabled={!trimmed}
              >
                Save as new
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-end gap-2">
            <Button size="sm" onPress={() => setNaming(true)}>
              Save as new…
            </Button>
            <Button
              autoFocus
              size="sm"
              variant="primary"
              onPress={() => {
                onUpdate()
                onOpenChange(false)
              }}
            >
              Update “{updateTarget}”
            </Button>
          </div>
        )}
      </DialogContent>
    </Modal>
  )
}
