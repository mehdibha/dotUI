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

export function ModalDemo() {
  return (
    <OverlayPreview
      variant="modal"
      surfaceClassName="space-y-3"
      trigger={<Button>Open Modal</Button>}
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
