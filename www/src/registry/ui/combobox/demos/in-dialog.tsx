import { ChevronDownIcon } from 'lucide-react'

import { Responsive } from '@/registry/lib/responsive'
import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Label } from '@/registry/ui/field'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Modal } from '@/registry/ui/modal'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Dialog>
      <Button variant="default">Open Dialog</Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Framework</DialogTitle>
                <DialogDescription>
                  Choose your preferred framework from the list below.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <Combobox>
                  <Label>Framework</Label>
                  <InputGroup>
                    <Input placeholder="Select a framework" />
                    <InputGroupAddon>
                      <Button variant="quiet" isIconOnly>
                        <ChevronDownIcon />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  <Popover>
                    <ListBox>
                      <ListBoxItem>Next.js</ListBoxItem>
                      <ListBoxItem>SvelteKit</ListBoxItem>
                      <ListBoxItem>Nuxt.js</ListBoxItem>
                      <ListBoxItem>Remix</ListBoxItem>
                      <ListBoxItem>Astro</ListBoxItem>
                    </ListBox>
                  </Popover>
                </Combobox>
              </DialogBody>
              <DialogFooter>
                <Button slot="close">Cancel</Button>
                <Button slot="close" variant="primary">
                  Confirm
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
