"use client"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"
import { TextField } from "@/registry/ui/text-field"

export default function Demo() {
  return (
    <Dialog>
      <Button>Open form sheet</Button>
      <Sheet>
        <DialogContent>
          <SheetHandle />
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              The sheet keeps the field in view above the keyboard.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-3">
            <TextField className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input defaultValue="Jane Doe" />
            </TextField>
            <TextField className="flex flex-col gap-1.5">
              <Label>Email</Label>
              <Input type="email" defaultValue="jane@example.com" />
            </TextField>
          </DialogBody>
          <DialogFooter>
            <Button slot="close" variant="quiet">
              Cancel
            </Button>
            <Button slot="close">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Sheet>
    </Dialog>
  )
}
