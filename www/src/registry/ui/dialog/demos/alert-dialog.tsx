"use client"

import { Responsive } from "@/registry/lib/responsive"
import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"
import { Sheet } from "@/registry/ui/sheet"

export default function Demo() {
  return (
    <Dialog>
      <Button variant="danger">Delete project</Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent role="alertdialog">
              <DialogHeader>
                <DialogTitle>Delete project</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this project? This action is
                  permanent and cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button slot="close" variant="secondary">
                  Cancel
                </Button>
                <Button slot="close" variant="danger">
                  Delete project
                </Button>
              </DialogFooter>
            </DialogContent>
          )
          return isMobile ? <Sheet>{content}</Sheet> : <Modal>{content}</Modal>
        }}
      />
    </Dialog>
  )
}
