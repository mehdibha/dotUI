import {
  ArchiveIcon,
  BellIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Drawer, DrawerHandle } from '@/registry/ui/drawer'
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from '@/registry/ui/menu'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <Menu>
      <Button variant="default" className="w-fit">
        Open drawer menu
      </Button>
      <Drawer placement="bottom">
        <DrawerHandle />
        <MenuContent>
          <MenuSection>
            <MenuSectionHeader>Account</MenuSectionHeader>
            <MenuItem>
              <UserIcon />
              Profile
            </MenuItem>
            <MenuItem>
              <BellIcon />
              Notifications
            </MenuItem>
            <MenuItem>
              <SettingsIcon />
              Settings
            </MenuItem>
          </MenuSection>
          <Separator />
          <MenuItem>
            <ArchiveIcon />
            Archive
          </MenuItem>
          <MenuItem variant="danger">
            <LogOutIcon />
            Log out
          </MenuItem>
        </MenuContent>
      </Drawer>
    </Menu>
  )
}
