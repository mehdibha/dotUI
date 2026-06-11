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
import { Overlay } from '@/registry/ui/overlay'

export default function Demo({
  title = 'Dialog Title',
  description = 'This is a dialog description.',
  isDismissable = true,
}: {
  title?: string
  description?: string
  isDismissable?: boolean
} = {}) {
  return (
    <Dialog>
      <Button>Open Dialog</Button>
      <Overlay data-control-target isDismissable={isDismissable}>
        <DialogContent>
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <DialogBody>
            <p>Dialog content goes here.</p>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button slot="close" variant="primary">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}
