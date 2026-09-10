"use client"

import { useState } from "react"
import type { Key } from "react-aria-components"

import { Button } from "@/registry/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectSectionHeader,
  SelectTrigger,
} from "@/registry/ui/select"
import { TextField } from "@/registry/ui/text-field"
import { PRESETS } from "@/modules/presets/presets-data"
import { encodeState } from "@/modules/studio/preset"
import type { SavedPreset } from "@/modules/studio/preset"

/**
 * Creates a new saved design system from a name and a starting point — a
 * built-in preset or one of the user's systems — then hands the snapshot back
 * to the panel to store and apply.
 */
/** "Start from" entry for the working state when it matches no preset. */
const CURRENT = "__current"

export function CreatePresetDialog({
  isOpen,
  onOpenChange,
  presets,
  activeId,
  currentState,
  onCreate,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  presets: SavedPreset[]
  /** The active saved preset, if any. */
  activeId?: string
  /** The working state, encoded. */
  currentState: string
  onCreate: (name: string, state: string) => void
}) {
  // Start from what's on screen: the active saved preset, else the built-in
  // the state matches, else the unsaved working state itself.
  const initialBase =
    (activeId && presets.some((p) => p.id === activeId) && activeId) ||
    PRESETS.find((p) => (encodeState(p.state) ?? "") === currentState)?.id ||
    CURRENT
  const [name, setName] = useState("")
  const [base, setBase] = useState<Key>(initialBase)
  // Fields reset on every open (the modal stays mounted between opens).
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) {
      setName("")
      setBase(initialBase)
    }
  }

  const trimmed = name.trim()

  function submit() {
    if (!trimmed) return
    const saved = presets.find((p) => p.id === base)
    const builtIn = PRESETS.find((p) => p.id === base)
    const state =
      base === CURRENT
        ? currentState
        : (saved?.state ?? (builtIn && encodeState(builtIn.state)) ?? "")
    onCreate(trimmed, state)
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
            Name it and pick what to start from. You can change everything
            after.
          </DialogDescription>
        </div>
        <form
          className="flex flex-col gap-4"
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
          <Select
            aria-label="Start from"
            selectedKey={base}
            onSelectionChange={(key) => {
              if (key != null) setBase(key)
            }}
          >
            <Label>Start from</Label>
            <SelectTrigger className="w-full" />
            <SelectContent>
              {initialBase === CURRENT && (
                <SelectItem id={CURRENT}>Current changes</SelectItem>
              )}
              <SelectSection>
                <SelectSectionHeader>Featured</SelectSectionHeader>
                {PRESETS.map((p) => (
                  <SelectItem key={p.id} id={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectSection>
              {presets.length > 0 && (
                <SelectSection>
                  <SelectSectionHeader>My systems</SelectSectionHeader>
                  {presets.map((p) => (
                    <SelectItem key={p.id} id={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectSection>
              )}
            </SelectContent>
          </Select>
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
