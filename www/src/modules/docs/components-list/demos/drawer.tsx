import { Button } from '@/registry/ui/button'
import { DialogHeader, DialogTitle } from '@/registry/ui/dialog'

import { OverlayScene } from '../overlay-scene'

export function DrawerDemo() {
  return (
    <OverlayScene variant="drawer" trigger={<Button>Open Drawer</Button>}>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <p className="mt-1 text-fg-muted">
        Manage your workspace preferences and notifications.
      </p>
    </OverlayScene>
  )
}
