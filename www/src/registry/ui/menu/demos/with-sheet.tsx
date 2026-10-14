import {
  ArchiveIcon,
  BellIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Separator } from "@/registry/ui/separator"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

export default function Demo() {
  return (
    <Menu>
      <Button variant="secondary" className="w-fit">
        Open sheet menu
      </Button>
      <Sheet>
        <SheetHandle />
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
      </Sheet>
    </Menu>
  )
}
