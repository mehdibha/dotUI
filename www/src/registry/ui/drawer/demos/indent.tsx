'use client'

import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer, DrawerHandle } from '@/registry/ui/drawer'

/**
 * The indent + indent-background effect is wired up at the app root
 * (see routes/__root.tsx). Open this drawer and watch the entire page
 * scale away to reveal the dark layer behind.
 */
export default function Demo() {
  return (
    <Dialog>
      <Button>Open drawer</Button>
      <Drawer>
        <DialogContent>
          <DrawerHandle />
          <DialogHeader>
            <DialogTitle>Notice the page behind</DialogTitle>
          </DialogHeader>
          <DialogBody>
            The whole app scales down while this drawer is open. Drag the handle
            to dismiss.
          </DialogBody>
        </DialogContent>
      </Drawer>
    </Dialog>
  )
}
