import { Button } from "@/registry/ui/button"
import {
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

import { OverlayPreview, PageMock } from "../overlay"

export function ModalDemo() {
  return (
    <OverlayPreview
      variant="modal"
      page={<PageMock />}
      surfaceClassName="flex flex-col gap-4"
    >
      <DialogHeader>
        <DialogTitle>Edit username</DialogTitle>
        <DialogDescription>
          Your username is visible to everyone in the workspace.
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        <TextField defaultValue="@mehdibha" className="w-full">
          <Label>Username</Label>
          <Input />
        </TextField>
      </DialogBody>
      <DialogFooter className="flex-row! justify-end">
        <Button variant="quiet">Cancel</Button>
        <Button variant="primary">Save</Button>
      </DialogFooter>
    </OverlayPreview>
  )
}
