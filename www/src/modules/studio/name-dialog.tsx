"use client"

/* The one name field of the studio, in a modal: Rename, New design system
   and Duplicate. */

import { useState } from "react"

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

import { cleanName } from "./workspace"

export interface NameRequest {
  title: string
  /** The submit button's label. */
  action: string
  name: string
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
  onSubmit,
  close,
}: NameRequest & { close: () => void }) {
  const [name, setName] = useState(initial)
  const clean = cleanName(name)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!clean) return
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
        maxLength={64}
        autoFocus
        onFocus={(e) => (e.target as HTMLInputElement).select()}
        className="w-full"
      >
        <Label>Name</Label>
        <Input />
      </TextField>
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button type="submit" variant="primary" isDisabled={!clean}>
          {action}
        </Button>
      </DialogFooter>
    </form>
  )
}
