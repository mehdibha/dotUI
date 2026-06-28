import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <div className="w-full max-w-xs rounded-md border bg-card shadow-sm">
      <div className="flex items-center gap-2 p-2">
        <Avatar size="sm">
          <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
          <AvatarFallback>MB</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm">
          <p>Mehdi Ben Hadj Ali</p>
          <p className="text-xs text-fg-muted">mehdi@example.com</p>
        </div>
      </div>
      <Separator />
      <ListBox aria-label="User menu">
        <ListBoxItem id="settings" textValue="Settings">
          <SettingsIcon />
          Settings
        </ListBoxItem>
        <ListBoxItem id="billing" textValue="Billing">
          <CreditCardIcon />
          Billing
        </ListBoxItem>
        <ListBoxItem id="notifications" textValue="Notifications">
          <BellIcon />
          Notifications
        </ListBoxItem>
        <Separator />
        <ListBoxItem id="logout" variant="danger" textValue="Log out">
          <LogOutIcon />
          Log out
        </ListBoxItem>
      </ListBox>
    </div>
  )
}
