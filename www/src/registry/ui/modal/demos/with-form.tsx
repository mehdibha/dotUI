'use client'

import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Modal } from '@/registry/ui/modal'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <Dialog>
      <Button>Edit Profile</Button>
      <Modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
              Your profile will be updated immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogBody scrollFade={false}>
            <TextField defaultValue="Pedro Duarte">
              <Label>Name</Label>
              <Input name="name" />
            </TextField>
            <TextField defaultValue="@peduarte">
              <Label>Username</Label>
              <Input name="username" />
            </TextField>
          </DialogBody>
          <DialogFooter>
            <Button slot="close" type="button">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}
