import {
  CopyIcon,
  MenuIcon,
  PlusSquareIcon,
  SquarePenIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Description, Label } from '@/registry/ui/field'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Menu>
      <Button variant="default" size="sm" isIconOnly>
        <MenuIcon />
      </Button>
      <Popover>
        <MenuContent>
          <MenuItem>
            <PlusSquareIcon />
            <Label>New file</Label>
            <Description>Create a new file</Description>
          </MenuItem>
          <MenuItem>
            <CopyIcon />
            <Label>Copy link</Label>
            <Description>Copy the file link</Description>
          </MenuItem>
          <MenuItem>
            <SquarePenIcon />
            <Label>Edit file</Label>
            <Description>Allows you to edit the file</Description>
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
