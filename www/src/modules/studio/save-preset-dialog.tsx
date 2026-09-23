"use client"

import { useEffect, useState } from "react"

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
import { PRESETS } from "@/modules/presets/presets-data"
import { useStudio } from "@/modules/studio/use-studio"

import { uniqueName, useMyPresets } from "./preset"
import { saveDesignSystemName, useDesignSystemName } from "./preset/storage"

/**
 * Snapshots the current design system to a named localStorage preset ("Save as").
 * When an active saved preset has diverged it also offers to update it in place.
 */
export function SavePresetDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { encoded } = useStudio()
  const { presets, activeId, save, update } = useMyPresets()
  const storedName = useDesignSystemName()

  const currentState = encoded ?? ""
  const active = presets.find((p) => p.id === activeId)
  const isDirty = active ? active.state !== currentState : false

  // Never a second "Linear" beside the built-in one, or a saved twin.
  const taken = [...PRESETS.map((p) => p.name), ...presets.map((p) => p.name)]
  const [name, setName] = useState("")
  // An edited built-in (or an untitled link) is new work: ask for its name
  // rather than suggest "Origin 2".
  const isOwnName =
    storedName !== "Untitled" && !PRESETS.some((p) => p.name === storedName)
  useEffect(() => {
    if (!isOpen) return
    setName(active?.name ?? (isOwnName ? uniqueName(storedName, taken) : ""))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- on open
  }, [isOpen, active?.name, storedName])

  const trimmed = name.trim()

  // The saved name becomes the working system's name — the panel header
  // reflects what was just saved.
  function saveAsNew() {
    const name = uniqueName(trimmed || storedName, taken)
    save(name, currentState)
    saveDesignSystemName(name)
    onOpenChange(false)
  }

  function updateActive() {
    if (!active) return
    update(active.id, currentState, trimmed || undefined)
    saveDesignSystemName(trimmed || active.name)
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
            Store the current design system under a name you can come back to.
          </DialogDescription>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!trimmed) return
            if (active && isDirty) updateActive()
            else saveAsNew()
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
          {active && isDirty ? (
            <>
              <Button size="sm" onPress={saveAsNew}>
                Save as new
              </Button>
              <Button size="sm" variant="primary" onPress={updateActive}>
                Update “{active.name}”
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onPress={saveAsNew}
              isDisabled={!trimmed}
            >
              Save
            </Button>
          )}
        </div>
      </DialogContent>
    </Modal>
  )
}
