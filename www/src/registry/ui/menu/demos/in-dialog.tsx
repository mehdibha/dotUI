import {
  ClipboardPasteIcon,
  CopyIcon,
  ScissorsIcon,
  TrashIcon,
} from '@/registry/__generated__/icons'
import { Responsive } from '@/registry/lib/responsive'
import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Menu, MenuContent, MenuItem, MenuSub } from '@/registry/ui/menu'
import { Modal } from '@/registry/ui/modal'
import { Popover } from '@/registry/ui/popover'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <Dialog>
      <Button variant="default">Open Dialog</Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dropdown Menu Example</DialogTitle>
                <DialogDescription>
                  Click the button below to see the menu.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <Menu>
                  <Button variant="default" className="w-fit">
                    Open Menu
                  </Button>
                  <Popover>
                    <MenuContent>
                      <MenuItem>
                        <CopyIcon />
                        Copy
                      </MenuItem>
                      <MenuItem>
                        <ScissorsIcon />
                        Cut
                      </MenuItem>
                      <MenuItem>
                        <ClipboardPasteIcon />
                        Paste
                      </MenuItem>
                      <Separator />
                      <MenuSub>
                        <MenuItem>More Options</MenuItem>
                        <Popover>
                          <MenuContent>
                            <MenuItem>Save Page...</MenuItem>
                            <MenuItem>Create Shortcut...</MenuItem>
                            <MenuItem>Name Window...</MenuItem>
                            <Separator />
                            <MenuItem>Developer Tools</MenuItem>
                          </MenuContent>
                        </Popover>
                      </MenuSub>
                      <Separator />
                      <MenuItem variant="danger">
                        <TrashIcon />
                        Delete
                      </MenuItem>
                    </MenuContent>
                  </Popover>
                </Menu>
              </DialogBody>
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
