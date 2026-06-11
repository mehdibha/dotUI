import { MenuIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
} from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Menu>
      <Button isIconOnly>
        <MenuIcon />
      </Button>
      <Popover>
        <MenuContent>
          <MenuItem>
            <MenuItemLabel>New file</MenuItemLabel>
            <MenuItemDescription>Create a new file</MenuItemDescription>
          </MenuItem>
          <MenuItem>
            <MenuItemLabel>Copy link</MenuItemLabel>
            <MenuItemDescription>Copy the file link</MenuItemDescription>
          </MenuItem>
          <MenuItem>
            <MenuItemLabel>Edit file</MenuItemLabel>
            <MenuItemDescription>
              Allows you to edit the file
            </MenuItemDescription>
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
