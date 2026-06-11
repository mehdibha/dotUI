'use client'

import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Overlay } from '@/registry/ui/overlay'

export default function Demo() {
  return (
    <Dialog>
      <Button variant="danger">Delete project</Button>
      <Overlay>
        <DialogContent role="alertdialog">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action is
              permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button slot="close" variant="default">
              Cancel
            </Button>
            <Button slot="close" variant="danger">
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}
