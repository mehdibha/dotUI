import {
  CreditCardIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MessageSquareIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <Menu>
      <Button variant="default" className="w-fit">
        Account
      </Button>
      <Popover>
        <MenuContent>
          <MenuItem textValue="Profile">
            <UserIcon />
            Profile
          </MenuItem>
          <MenuItem textValue="Billing">
            <CreditCardIcon />
            Billing
          </MenuItem>
          <MenuItem textValue="Settings">
            <SettingsIcon />
            Settings
          </MenuItem>
          <Separator />
          <MenuItem textValue="Support">
            <LifeBuoyIcon />
            Support
          </MenuItem>
          <MenuItem textValue="Feedback">
            <MessageSquareIcon />
            Feedback
          </MenuItem>
          <Separator />
          <MenuItem variant="danger" textValue="Log out">
            <LogOutIcon />
            Log out
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
