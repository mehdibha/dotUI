"use client"

import * as FormPrimitives from "react-aria-components/Form"

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
import { Modal } from "@/registry/ui/modal"
import { TextField } from "@/registry/ui/text-field"

export default function Demo() {
  return (
    <Dialog>
      <Button>Edit Profile</Button>
      <Modal>
        <DialogContent>
          {({ close }) => (
            <>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done. Your profile will be updated immediately.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <FormPrimitives.Form
                  id="edit-profile-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    close()
                  }}
                  className="flex flex-col gap-2"
                >
                  <TextField name="name" defaultValue="Pedro Duarte">
                    <Label>Name</Label>
                    <Input />
                  </TextField>
                  <TextField name="username" defaultValue="@peduarte">
                    <Label>Username</Label>
                    <Input />
                  </TextField>
                </FormPrimitives.Form>
              </DialogBody>
              <DialogFooter>
                <Button slot="close">Cancel</Button>
                <Button
                  type="submit"
                  form="edit-profile-form"
                  variant="primary"
                >
                  Save changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Modal>
    </Dialog>
  )
}
