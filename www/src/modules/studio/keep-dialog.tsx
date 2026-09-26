"use client"

/* Leaving a changed draft from the studio asks first: keep it under a name,
   or discard it. Publishing a draft asks for its name the same way. */

import { useState, useSyncExternalStore } from "react"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import { TextField } from "@/registry/ui/text-field"

import { remove } from "./history"
import { undoToast } from "./history-menu"
import { getCurrent } from "./selection"
import * as workspace from "./workspace"
import type { DesignSystemDoc } from "./workspace"

type Request =
  | {
      kind: "leave"
      doc: DesignSystemDoc
      then: () => void
      cancel?: () => void
    }
  | { kind: "publish"; doc: DesignSystemDoc; done: (kept: boolean) => void }

let request: Request | null = null
const listeners = new Set<() => void>()

function set(next: Request | null) {
  request = next
  for (const listener of listeners) listener()
}

/** Whether leaving the current design system asks first. */
export const leaving = () => workspace.isChangedDraft(getCurrent().doc)

/** Runs `then` once the current changed draft, if any, is kept or
 *  discarded; `cancel` runs if the user stays. */
export function leave(then: () => void, cancel?: () => void): void {
  const { doc } = getCurrent()
  if (doc && workspace.isChangedDraft(doc))
    set({ kind: "leave", doc, then, cancel })
  else then()
}

/** Names a draft before it is published; resolves whether it was kept. */
export function nameDraft(doc: DesignSystemDoc): Promise<boolean> {
  if (!doc.draft) return Promise.resolve(true)
  return new Promise((done) => set({ kind: "publish", doc, done }))
}

/** Publishes the system, naming a draft first; resolves the snapshot id,
 *  or undefined when the user cancels. */
export async function publishSystem(doc: DesignSystemDoc) {
  if (!(await nameDraft(doc))) return
  return workspace.publish(doc.id)
}

export function KeepDialog() {
  const current = useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => request,
    () => null,
  )

  return (
    <Dialog
      isOpen={current !== null}
      onOpenChange={(isOpen) => {
        if (isOpen || !request) return
        const closed = request
        set(null)
        if (closed.kind === "leave") closed.cancel?.()
        else closed.done(false)
      }}
    >
      <Modal className="sm:max-w-sm">
        <DialogContent aria-label="Keep your changes">
          {current && <KeepForm key={current.doc.id} request={current} />}
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

function KeepForm({ request: current }: { request: Request }) {
  const { doc } = current
  const [name, setName] = useState(() => workspace.keptName(doc))

  function keep() {
    set(null)
    workspace.keep(doc.id, workspace.cleanName(name) || workspace.keptName(doc))
    if (current.kind === "leave") current.then()
    else current.done(true)
  }

  function discard() {
    if (current.kind !== "leave") return
    set(null)
    undoToast(`Discarded "${doc.name}"`, remove(doc.id))
    current.then()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        keep()
      }}
      className="contents"
    >
      <DialogHeader>
        <DialogTitle>
          {current.kind === "leave"
            ? `Keep your changes to ${doc.name}?`
            : "Name your design system"}
        </DialogTitle>
      </DialogHeader>
      <TextField
        value={name}
        onChange={setName}
        maxLength={64}
        autoFocus
        onFocus={(e) => (e.target as HTMLInputElement).select()}
        className="w-full"
      >
        <Label>Name</Label>
        <Input />
      </TextField>
      <DialogFooter>
        {current.kind === "leave" ? (
          <Button onPress={discard}>Discard</Button>
        ) : (
          <Button slot="close">Cancel</Button>
        )}
        <Button type="submit" variant="primary">
          {current.kind === "leave" ? "Keep" : "Publish"}
        </Button>
      </DialogFooter>
    </form>
  )
}
