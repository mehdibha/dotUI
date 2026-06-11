'use client'

import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ShareIcon,
  TrashIcon,
  UserRoundXIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Group } from '@/registry/ui/group'
import { Menu, MenuContent, MenuItem, MenuSection } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Group>
        <Button>Update</Button>
        <Menu>
          <Button isIconOnly>
            <ChevronDownIcon />
          </Button>
          <Popover placement="bottom end">
            <MenuContent>
              <MenuItem>Disable</MenuItem>
              <MenuItem variant="danger">Uninstall</MenuItem>
            </MenuContent>
          </Popover>
        </Menu>
      </Group>
      <Group>
        <Button>Follow</Button>
        <Menu>
          <Button isIconOnly>
            <ChevronDownIcon />
          </Button>
          <Popover placement="bottom end" className="w-50">
            <MenuContent>
              <MenuSection>
                <MenuItem>
                  <CheckIcon />
                  Mark as Read
                </MenuItem>
                <MenuItem>
                  <AlertTriangleIcon />
                  Report Conversation
                </MenuItem>
                <MenuItem>
                  <UserRoundXIcon />
                  Block User
                </MenuItem>
                <MenuItem>
                  <ShareIcon />
                  Share Conversation
                </MenuItem>
                <MenuItem>
                  <CopyIcon />
                  Copy Conversation
                </MenuItem>
              </MenuSection>
              <Separator />
              <MenuSection>
                <MenuItem variant="danger">
                  <TrashIcon />
                  Delete Conversation
                </MenuItem>
              </MenuSection>
            </MenuContent>
          </Popover>
        </Menu>
      </Group>
    </div>
  )
}
