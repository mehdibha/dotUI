import { MenuIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Menu>
      <Button variant="default" isIconOnly>
        <MenuIcon />
      </Button>
      <Popover>
        <MenuContent>
          <MenuItem>
            New file
            <Kbd>⌘N</Kbd>
          </MenuItem>
          <MenuItem>
            Copy link
            <Kbd>⌘C</Kbd>
          </MenuItem>
          <MenuItem>
            Edit file
            <Kbd>⌘⇧E</Kbd>
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
