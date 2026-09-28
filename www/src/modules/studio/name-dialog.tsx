"use client"

/* The studio's one name field, in a modal: Save, Rename, and New design
   system, which also picks what to start from. */

import { useRef, useState } from "react"

import { MAX_NAME_LENGTH } from "@/lib/snapshots/snapshot"
import { Button } from "@/registry/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { FieldError, Label } from "@/registry/ui/field"
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
import { PRESET_META } from "@/modules/presets"

import { createFrom, saveName } from "./history"
import { keySelection, selectionKey, useCurrent } from "./selection"
import type { Selection } from "./selection"
import { cleanName, listed, useWorkspace } from "./workspace"
import type { Workspace } from "./workspace"

export interface NameRequest {
  title: string
  /** The submit button's label. */
  action: string
  name: string
  /** Names other systems have: names are unique. */
  taken: string[]
  /** Adds a Start from select, set to this key; "current" is what's on
   *  screen. */
  startFrom?: string
  /** `source` is the Start from choice, else what's on screen. */
  onSubmit: (name: string, source: Selection) => void
}

/** Saving the unsaved slot, as "My <view>" by default. */
export function saveRequest({
  unsaved,
  systems,
}: Workspace): NameRequest | undefined {
  if (!unsaved) return
  return {
    title: "Save design system",
    action: "Save",
    name: saveName(unsaved, systems),
    taken: systems.map((s) => s.name),
    onSubmit: (name) => createFrom(name, { kind: "unsaved" }),
  }
}

export function NameDialog({
  request,
  onClose,
}: {
  request?: NameRequest
  onClose: () => void
}) {
  // Still shown while the dialog animates out.
  const [shown, setShown] = useState(request)
  if (request && request !== shown) setShown(request)
  return (
    // Not dismissed by a press outside: a double click's second press on
    // what opened it lands there.
    <Modal
      isOpen={!!request}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      isDismissable={false}
      className="sm:max-w-sm"
    >
      <DialogContent>
        {shown && (
          <NameForm
            key={`${shown.title}:${shown.name}:${shown.startFrom}`}
            {...shown}
            close={onClose}
          />
        )}
      </DialogContent>
    </Modal>
  )
}

function NameForm({
  title,
  action,
  name: initial,
  taken,
  startFrom,
  onSubmit,
  close,
}: NameRequest & { close: () => void }) {
  const current = useCurrent()
  const [name, setName] = useState(initial)
  const [source, setSource] = useState(startFrom ?? "current")
  // The form stays while the dialog animates out: a double submit is one.
  const submitted = useRef(false)
  const clean = cleanName(name)
  const isTaken = taken.includes(clean)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!clean || isTaken || submitted.current) return
        submitted.current = true
        close()
        onSubmit(
          clean,
          source === "current" ? current.sel : keySelection(source),
        )
      }}
      className="contents"
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <TextField
        value={name}
        onChange={setName}
        maxLength={MAX_NAME_LENGTH}
        autoFocus
        onFocus={(e) => (e.target as HTMLInputElement).select()}
        isInvalid={isTaken}
        className="w-full"
      >
        <Label>Name</Label>
        <Input />
        <FieldError>Another design system has this name.</FieldError>
      </TextField>
      {startFrom !== undefined && (
        <StartFrom current={current.name} value={source} onChange={setSource} />
      )}
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button type="submit" variant="primary" isDisabled={!clean || isTaken}>
          {action}
        </Button>
      </DialogFooter>
    </form>
  )
}

function StartFrom({
  current,
  value,
  onChange,
}: {
  current: string
  value: string
  onChange: (key: string) => void
}) {
  const systems = listed(useWorkspace())
  return (
    <Select
      value={value}
      onChange={(key) => key !== null && onChange(String(key))}
      className="w-full"
    >
      <Label>Start from</Label>
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="current">{`Current · ${current}`}</SelectItem>
        <SelectSection>
          <SelectSectionHeader>Presets</SelectSectionHeader>
          {PRESET_META.map((preset) => (
            <SelectItem
              key={preset.id}
              id={selectionKey({ kind: "preset", id: preset.id })}
            >
              {preset.name}
            </SelectItem>
          ))}
        </SelectSection>
        {systems.length > 0 && (
          <SelectSection>
            <SelectSectionHeader>My design systems</SelectSectionHeader>
            {systems.map((system) => (
              <SelectItem
                key={system.id}
                id={selectionKey({ kind: "system", id: system.id })}
              >
                {system.name}
              </SelectItem>
            ))}
          </SelectSection>
        )}
      </SelectContent>
    </Select>
  )
}
