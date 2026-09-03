import { Button } from "@/registry/ui/button"
import {
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

import { OverlayPreview } from "../overlay"

// A page mock (header + text blocks) sits behind the backdrop so the modal
// reads as opened over real content.
function Page() {
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded-full bg-muted" />
        <div className="size-6 rounded-full bg-muted" />
      </div>
      <div className="mt-2 h-3 w-full rounded-full bg-muted" />
      <div className="h-3 w-5/6 rounded-full bg-muted" />
      <div className="h-3 w-2/3 rounded-full bg-muted" />
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
      </div>
    </div>
  )
}

export function ModalDemo() {
  return (
    <OverlayPreview
      variant="modal"
      page={<Page />}
      surfaceClassName="space-y-3"
    >
      <DialogHeader>
        <DialogTitle>Edit username</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <TextField defaultValue="@mehdibha" className="w-full">
          <Label>Username</Label>
          <Input />
        </TextField>
      </DialogBody>
      <DialogFooter className="flex-row! justify-end">
        <Button variant="quiet">Cancel</Button>
        <Button variant="primary">Apply</Button>
      </DialogFooter>
    </OverlayPreview>
  )
}
