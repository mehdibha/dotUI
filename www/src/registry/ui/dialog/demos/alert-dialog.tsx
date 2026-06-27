'use client'

import { Responsive } from '@/registry/lib/responsive'
import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Modal } from '@/registry/ui/modal'

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
                <Button slot="close" variant="default">
                  Cancel
                </Button>
                <Button slot="close" variant="danger">
                  Delete project
                </Button>
              </DialogFooter>
            </DialogContent>
          )
          return isMobile ? (
            <Drawer>{content}</Drawer>
          ) : (
            <Modal>{content}</Modal>
          )
        }}
      />
    </Dialog>
  )
}
