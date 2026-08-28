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

import { encodePreset, useDesignSystem, useMyPresets } from "./preset"
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
  const { designSystem } = useDesignSystem()
  const { presets, activeId, save, update } = useMyPresets()
  const storedName = useDesignSystemName()

  const currentState = encodePreset(designSystem) ?? ""
  const active = presets.find((p) => p.id === activeId)
  const isDirty = active ? active.state !== currentState : false

  const [name, setName] = useState("")
  useEffect(() => {
    if (isOpen) setName(active?.name ?? storedName)
  }, [isOpen, active?.name, storedName])

  const trimmed = name.trim()

  // The saved name becomes the working system's name — the panel header
  // reflects what was just saved.
  function saveAsNew() {
    const name = trimmed || storedName
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
      <DialogContent aria-label="Save preset" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <DialogTitle className="text-base font-semibold">
            Save preset
          </DialogTitle>
          <DialogDescription className="text-sm text-fg-muted">
            Store the current system as a named preset you can reapply later.
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
            aria-label="Preset name"
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
