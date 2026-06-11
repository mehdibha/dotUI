import {
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  UserIcon,
} from '@/registry/__generated__/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import { Button } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem, MenuSection } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Separator } from '@/registry/ui/separator'

const accountItems = (
  <>
    <MenuSection>
      <MenuItem>
        <UserIcon />
        Account
      </MenuItem>
      <MenuItem>
        <CreditCardIcon />
        Billing
      </MenuItem>
      <MenuItem>
        <BellIcon />
        Notifications
      </MenuItem>
    </MenuSection>
    <Separator />
    <MenuItem>
      <LogOutIcon />
      Sign Out
    </MenuItem>
  </>
)

export default function Demo() {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <Menu>
        <Button
          variant="default"
          className="h-12 justify-start gap-2 px-2 md:max-w-[200px]"
        >
          <Avatar size="sm">
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">shadcn</span>
            <span className="truncate text-xs text-fg-muted">
              shadcn@example.com
            </span>
          </div>
          <ChevronsUpDownIcon className="ml-auto text-fg-muted" />
        </Button>
        <Popover className="min-w-56">
          <MenuContent>{accountItems}</MenuContent>
        </Popover>
      </Menu>
      <Menu>
        <Button variant="quiet" isIconOnly className="rounded-full">
          <Avatar size="sm">
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </Button>
        <Popover placement="top end">
          <MenuContent>{accountItems}</MenuContent>
        </Popover>
      </Menu>
    </div>
  )
}
