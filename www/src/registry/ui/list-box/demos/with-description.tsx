import {
  GitBranchIcon,
  GlobeIcon,
  ShieldCheckIcon,
  UserIcon,
} from 'lucide-react'

import {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
} from '@/registry/ui/list-box'

export default function Demo() {
  return (
    <div className="rounded-md border bg-card shadow-sm">
      <ListBox
        aria-label="Permissions"
        selectionMode="single"
        defaultSelectedKeys={['read']}
      >
        <ListBoxItem id="read" textValue="Read">
          <UserIcon />
          <ListBoxItemLabel>Read</ListBoxItemLabel>
          <ListBoxItemDescription>
            View files and discussions.
          </ListBoxItemDescription>
        </ListBoxItem>
        <ListBoxItem id="write" textValue="Write" isDisabled>
          <GitBranchIcon />
          <ListBoxItemLabel>Write</ListBoxItemLabel>
          <ListBoxItemDescription>
            Push branches and open pull requests.
          </ListBoxItemDescription>
        </ListBoxItem>
        <ListBoxItem id="maintain" textValue="Maintain">
          <ShieldCheckIcon />
          <ListBoxItemLabel>Maintain</ListBoxItemLabel>
          <ListBoxItemDescription>
            Manage the repository without admin access.
          </ListBoxItemDescription>
        </ListBoxItem>
        <ListBoxItem id="admin" textValue="Admin">
          <GlobeIcon />
          <ListBoxItemLabel>Admin</ListBoxItemLabel>
          <ListBoxItemDescription>
            Full access including settings and billing.
          </ListBoxItemDescription>
        </ListBoxItem>
      </ListBox>
    </div>
  )
}
