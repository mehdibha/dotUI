'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/registry/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Modal } from '@/registry/ui/modal'
import { TextField } from '@/registry/ui/text-field'

import { encodePreset, useDesignSystem, useMyPresets } from './preset'
import { useDesignSystemName } from './preset/storage'

/**
 * Snapshots the current design system to a named localStorage preset ("Save as").
 * When an active saved preset has diverged it also offers to update it in place.
 */
export function SavePresetDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { designSystem } = useDesignSystem()
  const { presets, activeId, save, update } = useMyPresets()
  const storedName = useDesignSystemName()

  const currentState = encodePreset(designSystem) ?? ''
  const active = presets.find((p) => p.id === activeId)
  const isDirty = active ? active.state !== currentState : false

  const [name, setName] = useState('')
  useEffect(() => {
    if (isOpen) setName(active?.name ?? storedName)
  }, [isOpen, active?.name, storedName])

  const trimmed = name.trim()

  function saveAsNew() {
    save(trimmed || storedName, currentState)
    setIsOpen(false)
  }

  function updateActive() {
    if (active) update(active.id, currentState, trimmed || undefined)
    setIsOpen(false)
  }

  return (
    <>
      <Button size="sm" className="shrink-0" onPress={() => setIsOpen(true)}>
        Save
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
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
              <Input placeholder="Untitled" />
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
    </>
  )
}
