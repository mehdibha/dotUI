"use client"

/* The one name field of the studio, in a modal: Rename, New design system
   and Duplicate. */

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
import { TextField } from "@/registry/ui/text-field"

import { cleanName } from "./workspace"

export interface NameRequest {
  title: string
  /** The submit button's label. */
  action: string
  name: string
  /** Names other systems have: names are unique. */
  taken: string[]
  onSubmit: (name: string) => void
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
          <NameForm key={shown.title + shown.name} {...shown} close={onClose} />
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
  onSubmit,
  close,
}: NameRequest & { close: () => void }) {
  const [name, setName] = useState(initial)
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
        onSubmit(clean)
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
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button type="submit" variant="primary" isDisabled={!clean || isTaken}>
          {action}
        </Button>
      </DialogFooter>
    </form>
  )
}
