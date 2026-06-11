import { Button } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <Menu>
      <Button variant="default">File</Button>
      <Popover>
        <MenuContent>
          <MenuItem>New...</MenuItem>
          <MenuItem>Badges</MenuItem>
          <Separator />
          <MenuItem>Save</MenuItem>
          <MenuItem>Save as...</MenuItem>
          <MenuItem>Rename...</MenuItem>
          <Separator />
          <MenuItem>Page setup…</MenuItem>
          <MenuItem>Print…</MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
