import {
  CreditCardIcon,
  HelpCircleIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  SettingsIcon,
  UserIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
  MenuSub,
} from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <Menu>
      <Button variant="default" className="w-fit">
        Complex Menu
      </Button>
      <Popover className="w-56">
        <MenuContent>
          <MenuSection>
            <MenuSectionHeader>My Account</MenuSectionHeader>
            <MenuItem>
              <UserIcon />
              Profile
              <Kbd className="ml-auto">⇧⌘P</Kbd>
            </MenuItem>
            <MenuItem>
              <CreditCardIcon />
              Billing
              <Kbd className="ml-auto">⌘B</Kbd>
            </MenuItem>
            <MenuItem>
              <SettingsIcon />
              Settings
              <Kbd className="ml-auto">⌘S</Kbd>
            </MenuItem>
          </MenuSection>
          <Separator />
          <MenuSub>
            <MenuItem>
              <UserIcon />
              Invite Users
            </MenuItem>
            <Popover>
              <MenuContent>
                <MenuSection>
                  <MenuItem>
                    <MailIcon />
                    Email
                  </MenuItem>
                  <MenuItem>
                    <MessageSquareIcon />
                    Message
                  </MenuItem>
                </MenuSection>
                <Separator />
                <MenuItem>More...</MenuItem>
              </MenuContent>
            </Popover>
          </MenuSub>
          <Separator />
          <MenuItem>
            <HelpCircleIcon />
            Support
          </MenuItem>
          <MenuItem variant="danger">
            <LogOutIcon />
            Sign Out
            <Kbd className="ml-auto">⇧⌘Q</Kbd>
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
