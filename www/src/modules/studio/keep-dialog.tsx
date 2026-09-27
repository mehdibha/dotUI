"use client"

/* Leaving a changed draft from the studio asks first: keep it under a name,
   or discard it. */

import { useEffect, useState, useSyncExternalStore } from "react"
import { useRouter } from "@tanstack/react-router"

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

interface Request {
  doc: DesignSystemDoc
  then: () => void
  cancel?: () => void
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
  closed.cancel?.()
}

/** Whether leaving the current design system asks first. */
export const leaving = () => workspace.isChangedDraft(getCurrent().doc)

/** Runs `then` once the current changed draft, if any, is kept or
 *  discarded; `cancel` runs if the user stays. */
export function leave(then: () => void, cancel?: () => void): void {
  const { doc } = getCurrent()
  if (doc && workspace.isChangedDraft(doc)) set({ doc, then, cancel })
  else then()
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

  // Leaving the studio (Back included) abandons the question, callbacks and
  // all: coming back must not find it waiting.
  const router = useRouter()
  useEffect(
    () =>
      router.subscribe("onBeforeNavigate", ({ pathChanged }) => {
        if (pathChanged && request) set(null)
      }),
    [router],
  )

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
 *  opened it, else to the dialog it sat in, else to a neighbour. */
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
    current.then()
  }

  function discard() {
    if (!answer()) return
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
        <DialogTitle>Keep your changes to {doc.name}?</DialogTitle>
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
        <Button onPress={discard}>Discard</Button>
        <Button type="submit" variant="primary">
          Keep
        </Button>
      </DialogFooter>
    </form>
  )
}
