"use client"

/* Leaving a changed draft from the studio asks first: keep it under a name,
   or discard it. Publishing a draft asks for its name the same way. */

import { useEffect, useState, useSyncExternalStore } from "react"

import { Button } from "@/registry/ui/button"
import {
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
import { getCurrent, useCurrent } from "./selection"
import * as workspace from "./workspace"
import type { DesignSystemDoc } from "./workspace"

type Request =
  | {
      kind: "leave"
      doc: DesignSystemDoc
      then: () => void
      cancel?: () => void
    }
  | {
      kind: "publish"
      doc: DesignSystemDoc
      done: (kept: boolean) => void
      asked: Promise<boolean>
    }

let request: Request | null = null
const listeners = new Set<() => void>()

function set(next: Request | null) {
  request = next
  for (const listener of listeners) listener()
}

/** Closes the dialog as if the user stayed. */
function cancel() {
  const closed = request
  if (!closed) return
  set(null)
  if (closed.kind === "leave") closed.cancel?.()
  else closed.done(false)
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
  if (request?.kind === "publish" && request.doc.id === doc.id)
    return request.asked
  let done: (kept: boolean) => void = () => {}
  const asked = new Promise<boolean>((resolve) => (done = resolve))
  set({ kind: "publish", doc, done, asked })
  return asked
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
  // Still shown while the dialog animates out.
  const [shown, setShown] = useState(current)
  if (current && current !== shown) setShown(current)

  // A pick elsewhere (the docs, another tab) moved off the draft it asks about.
  const currentId = useCurrent().doc?.id
  useEffect(() => {
    if (current && current.doc.id !== currentId) cancel()
  }, [current, currentId])

  return (
    // No trigger, so no Dialog wrapper. Only Esc or a button closes it: the
    // second click of a double click on what opened it lands outside.
    <Modal
      isOpen={current !== null}
      onOpenChange={(isOpen) => !isOpen && cancel()}
      isDismissable={false}
      className="sm:max-w-sm"
    >
      <DialogContent
        showCloseButton
        // A press on its empty space (often a double click's second press,
        // landing where the button that opened it was) keeps the name field
        // focused, so Enter still answers.
        onMouseDown={(e) => {
          if (!(e.target as Element).closest("input, button, label"))
            e.preventDefault()
        }}
      >
        <RestoreFocus />
        {shown && <KeepForm key={shown.doc.id} request={shown} />}
      </DialogContent>
    </Modal>
  )
}

/** Once the dialog is gone, focus that fell to the page goes back to what
 *  opened it — or, as a publish swapped that out, to the dialog it sat in
 *  (Share, Export), else to what replaced it (Published ✓). */
function RestoreFocus() {
  const [opener] = useState(() => {
    const active = document.activeElement
    if (!(active instanceof HTMLElement) || active === document.body) return
    return {
      element: active,
      dialog: active.closest<HTMLElement>("[role=dialog]"),
      parent: active.parentElement,
    }
  })
  useEffect(
    () => () => {
      if (!opener) return
      // After react-aria's own restore, a frame past the unmount.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const targets = [
            opener.element,
            opener.dialog,
            opener.parent?.querySelector<HTMLElement>(
              "button, [role=button], input, [tabindex]",
            ),
          ]
          for (const target of targets) {
            const active = document.activeElement
            if (active && active !== document.body) return
            if (target?.isConnected) target.focus()
          }
        }),
      )
    },
    [opener],
  )
  return null
}

function KeepForm({ request: current }: { request: Request }) {
  const { doc } = current
  const [name, setName] = useState(() => workspace.keptName(doc))

  // Once answered, a double click's second press finds nothing to do.
  const answer = () => {
    if (request !== current) return false
    set(null)
    return true
  }

  function keep() {
    if (!answer()) return
    workspace.keep(doc.id, workspace.cleanName(name) || workspace.keptName(doc))
    if (current.kind === "leave") current.then()
    else current.done(true)
  }

  function discard() {
    if (current.kind !== "leave" || !answer()) return
    remove(doc.id, { verb: "Discarded" })
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
