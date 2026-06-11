'use client'

import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'

export function DrawerDemo() {
  return (
    <Dialog>
      <Button>Open Drawer</Button>
      <Drawer placement="bottom">
        <DialogContent>drawer content</DialogContent>
      </Drawer>
    </Dialog>
  )
}
