import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <Menu>
      <Button variant="default" className="w-fit">
        Open
      </Button>
      <Popover>
        <MenuContent>
          <MenuSection>
            <MenuSectionHeader>My Account</MenuSectionHeader>
            <MenuItem>
              Profile
              <Kbd className="ml-auto">⇧⌘P</Kbd>
            </MenuItem>
            <MenuItem>
              Billing
              <Kbd className="ml-auto">⌘B</Kbd>
            </MenuItem>
            <MenuItem>
              Settings
              <Kbd className="ml-auto">⌘S</Kbd>
            </MenuItem>
            <MenuItem>
              Keyboard shortcuts
              <Kbd className="ml-auto">⌘K</Kbd>
            </MenuItem>
          </MenuSection>
          <Separator />
          <MenuItem>
            Log out
            <Kbd className="ml-auto">⇧⌘Q</Kbd>
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
