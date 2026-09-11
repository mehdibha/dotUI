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
 * Names a new design system. It starts from Origin — a blank canvas; forking
 * a featured or saved system is pick it, edit, Save as new.
 */
export function CreatePresetDialog({
  isOpen,
  onOpenChange,
  onCreate,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string) => void
}) {
  const [name, setName] = useState("")
  // The field resets on every open (the modal stays mounted between opens).
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) setName("")
  }

  const trimmed = name.trim()

  function submit() {
    if (!trimmed) return
    onCreate(trimmed)
    onOpenChange(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-full sm:max-w-sm"
    >
      <DialogContent
        aria-label="New design system"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <DialogTitle className="text-base font-semibold">
            New design system
          </DialogTitle>
          <DialogDescription className="text-sm text-fg-muted">
            Starts from Origin, the default look. Every decision is yours from
            there.
          </DialogDescription>
        </div>
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
            isDisabled={!trimmed}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Modal>
  )
}
