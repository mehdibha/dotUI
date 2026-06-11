import { MenuIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <Menu>
      <Button variant="default" isIconOnly>
        <MenuIcon />
      </Button>
      <Popover>
        <MenuContent>
          <MenuSection>
            <MenuSectionHeader>Notifications</MenuSectionHeader>
            <MenuItem>Push notifications</MenuItem>
            <MenuItem>Badges</MenuItem>
          </MenuSection>
          <MenuSection>
            <MenuSectionHeader>Panels</MenuSectionHeader>
            <MenuItem id="console">Console</MenuItem>
            <MenuItem>Search</MenuItem>
          </MenuSection>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
