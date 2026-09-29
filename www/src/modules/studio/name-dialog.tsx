"use client"

/* The studio's one name field, in a modal: Save, Rename, and New design
   system, which also picks what to start from. */

import { useEffect, useRef, useState } from "react"

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
import { describe, keySelection, selectionKey, useCurrent } from "./selection"
import type { Selection } from "./selection"
import { cleanName, isUnreadable, listed, useWorkspace } from "./workspace"
import type { Workspace } from "./workspace"

export interface NameRequest {
  title: string
  /** The submit button's label. */
  action: string
  name: string
  /** What is named, when it exists already: its own name is free, and the
   *  dialog closes once another tab deletes or saves it. */
  subject?: Selection
  /** Adds a Start from select, set to this key; "current" is what's on
   *  screen. */
  startFrom?: string
  /** `source` is the Start from choice, else what's on screen. */
  onSubmit: (name: string, source: Selection) => void
}

/** Saving the unsaved slot, as "My <view>" by default; never while the
 *  stored systems can't be read, as the save wouldn't last. */
export function saveRequest({
  unsaved,
  systems,
}: Workspace): NameRequest | undefined {
  if (!unsaved || isUnreadable()) return
  return {
    title: "Save design system",
    action: "Save",
    name: saveName(unsaved, systems),
    subject: { kind: "unsaved" },
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
  const workspace = useWorkspace()
  const subject = request?.subject
  const gone =
    !!subject && describe(subject, workspace).key !== selectionKey(subject)
  useEffect(() => {
    if (gone) onClose()
  }, [gone, onClose])
  // Still shown while the dialog animates out.
  const [shown, setShown] = useState(request)
  if (request && request !== shown) setShown(request)
  return (
    // Not dismissed by a press outside: a double click's second press on
    // what opened it lands there.
    <Modal
      isOpen={!!request && !gone}
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
  subject,
  startFrom,
  onSubmit,
  close,
}: NameRequest & { close: () => void }) {
  const current = useCurrent()
  const workspace = useWorkspace()
  const [name, setName] = useState(initial)
  const [picked, setPicked] = useState(startFrom ?? "current")
  // The form stays while the dialog animates out: a double submit is one.
  const submitted = useRef(false)
  const clean = cleanName(name)
  const isTaken = workspace.systems.some(
    (s) =>
      s.name === clean && !(subject?.kind === "system" && subject.id === s.id),
  )
  // A source gone meanwhile, deleted in another tab, falls back to Current.
  const source =
    picked !== "current" &&
    describe(keySelection(picked), workspace).key === picked
      ? keySelection(picked)
      : undefined
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!clean || isTaken || submitted.current) return
        submitted.current = true
        close()
        onSubmit(clean, source ?? current.sel)
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
        <StartFrom
          current={current.name}
          currentKey={selectionKey(current.sel)}
          workspace={workspace}
          value={source ? picked : "current"}
          onChange={setPicked}
        />
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
  currentKey,
  workspace,
  value,
  onChange,
}: {
  current: string
  currentKey: string
  workspace: Workspace
  value: string
  onChange: (key: string) => void
}) {
  // What's on screen is listed once, as Current.
  const presets = PRESET_META.filter(
    (preset) => selectionKey({ kind: "preset", id: preset.id }) !== currentKey,
  )
  const systems = listed(workspace).filter(
    (system) => selectionKey({ kind: "system", id: system.id }) !== currentKey,
  )
  return (
    <Select
      value={value}
      onChange={(key) => key !== null && onChange(String(key))}
      className="w-full"
    >
      <Label>Start from</Label>
      <SelectTrigger />
      {/* Long names wrap within the field's width. */}
      <SelectContent className="max-w-(--trigger-width)">
        <SelectItem id="current">{`Current · ${current}`}</SelectItem>
        <SelectSection>
          <SelectSectionHeader>Presets</SelectSectionHeader>
          {presets.map((preset) => (
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
