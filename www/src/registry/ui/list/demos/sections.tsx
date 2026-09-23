import { CreditCardIcon, LogOutIcon, PlusIcon, UserIcon } from "lucide-react"

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemLabel,
  ListItemValue,
  ListSection,
  ListSectionHeader,
} from "@/registry/ui/list"

export default function Demo() {
  return (
    <List aria-label="Settings" className="w-full max-w-sm">
      <ListSection>
        <ListSectionHeader>Account</ListSectionHeader>
        <ListItem href="#profile" textValue="Profile">
          <ListItemIcon>
            <UserIcon />
          </ListItemIcon>
          <ListItemLabel>Profile</ListItemLabel>
        </ListItem>
        <ListItem href="#billing" textValue="Billing">
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          <ListItemLabel>Billing</ListItemLabel>
          <ListItemValue>Pro plan</ListItemValue>
        </ListItem>
        <ListItem variant="accent" textValue="Add account">
          <ListItemIcon>
            <PlusIcon />
          </ListItemIcon>
          <ListItemLabel>Add account</ListItemLabel>
        </ListItem>
      </ListSection>
      <ListSection>
        <ListItem variant="danger" textValue="Log out">
          <ListItemIcon>
            <LogOutIcon />
          </ListItemIcon>
          <ListItemLabel>Log out</ListItemLabel>
        </ListItem>
      </ListSection>
    </List>
  )
}
