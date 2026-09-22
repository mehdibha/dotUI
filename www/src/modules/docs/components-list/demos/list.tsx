import { BellIcon, UserIcon } from "lucide-react"

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemLabel,
  ListItemValue,
} from "@/registry/ui/list"

export function ListDemo() {
  return (
    <List aria-label="Account" className="w-56">
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
        <ListItemLabel>Alerts</ListItemLabel>
        <ListItemValue>On</ListItemValue>
      </ListItem>
    </List>
  )
}
