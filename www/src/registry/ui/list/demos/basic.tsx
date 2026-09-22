import { BellIcon, LockIcon, UserIcon } from "lucide-react"

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemLabel,
  ListItemValue,
} from "@/registry/ui/list"

export default function Demo() {
  return (
    <List aria-label="Account" className="w-full max-w-sm">
      <ListItem href="#profile" textValue="Profile">
        <ListItemIcon>
          <UserIcon />
        </ListItemIcon>
        <ListItemLabel>Profile</ListItemLabel>
      </ListItem>
      <ListItem href="#notifications" textValue="Notifications">
        <ListItemIcon>
          <BellIcon />
        </ListItemIcon>
        <ListItemLabel>Notifications</ListItemLabel>
        <ListItemValue>On</ListItemValue>
      </ListItem>
      <ListItem href="#privacy" textValue="Privacy">
        <ListItemIcon>
          <LockIcon />
        </ListItemIcon>
        <ListItemLabel>Privacy</ListItemLabel>
      </ListItem>
    </List>
  )
}
