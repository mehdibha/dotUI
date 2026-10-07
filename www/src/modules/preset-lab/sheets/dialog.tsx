import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Drawer } from "@/registry/ui/drawer"
import { Description, Label } from "@/registry/ui/field"
import { Input, TextArea } from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import { TextField } from "@/registry/ui/text-field"

import { Sheet } from "./layout"

function Form() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Create a new issue</DialogTitle>
        <DialogDescription>
          Report a bug or request a feature. Your team will be notified.
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        <TextField defaultValue="Focus ring missing in dialogs">
          <Label>Title</Label>
          <Input />
        </TextField>
        <TextField>
          <Label>Description</Label>
          <TextArea placeholder="What happened?" rows={3} />
          <Description>Markdown is supported.</Description>
        </TextField>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Create issue</Button>
      </DialogFooter>
    </>
  )
}

/** The page under the overlay, so the backdrop has something to cover. */
export function Backdrop() {
  return (
    <Sheet className="grid-cols-3">
      <h1 className="col-span-3 text-2xl">Issues</h1>
      {["Billing export", "Onboarding flow", "Search latency"].map((title) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Updated 2 hours ago</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Badge variant="accent">In progress</Badge>
            <Badge>Backend</Badge>
          </CardContent>
        </Card>
      ))}
      <div className="col-span-3 h-72 rounded-(--studio-radius-card) bg-muted" />
    </Sheet>
  )
}

// Controlled `isOpen` without a setter: the overlay can't be dismissed.
export function DialogSheet() {
  return (
    <>
      <Backdrop />
      <Modal isOpen isDismissable={false}>
        <DialogContent showCloseButton>
          <Form />
        </DialogContent>
      </Modal>
    </>
  )
}

export function DrawerSheet() {
  return (
    <>
      <Backdrop />
      <Drawer isOpen placement="right" className="w-[420px]">
        <DialogContent showCloseButton>
          <Form />
        </DialogContent>
      </Drawer>
    </>
  )
}
