import {
  CopyIcon,
  GitBranchIcon,
  GlobeIcon,
  PencilIcon,
  ShareIcon,
  ShieldCheckIcon,
  StarIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react'
import {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
  ListBoxSection,
  ListBoxSectionHeader,
} from 'www'

const card: React.CSSProperties = {
  width: 280,
  borderRadius: 8,
  border: '1px solid var(--border, rgba(0,0,0,0.1))',
  overflow: 'hidden',
}

export const WithIcons = () => (
  <div style={card}>
    <ListBox aria-label="Actions" selectionMode="single" defaultSelectedKeys={['edit']}>
      <ListBoxItem id="edit" textValue="Edit">
        <PencilIcon />
        Edit
      </ListBoxItem>
      <ListBoxItem id="copy" textValue="Copy link">
        <CopyIcon />
        Copy link
      </ListBoxItem>
      <ListBoxItem id="share" textValue="Share">
        <ShareIcon />
        Share
      </ListBoxItem>
      <ListBoxItem id="favorite" textValue="Add to favorites">
        <StarIcon />
        Add to favorites
      </ListBoxItem>
      <ListBoxItem id="delete" textValue="Delete" variant="danger">
        <Trash2Icon />
        Delete
      </ListBoxItem>
    </ListBox>
  </div>
)

export const WithDescriptions = () => (
  <div style={card}>
    <ListBox aria-label="Permissions" selectionMode="single" defaultSelectedKeys={['read']}>
      <ListBoxItem id="read" textValue="Read">
        <UserIcon />
        <ListBoxItemLabel>Read</ListBoxItemLabel>
        <ListBoxItemDescription>View files and discussions.</ListBoxItemDescription>
      </ListBoxItem>
      <ListBoxItem id="write" textValue="Write">
        <GitBranchIcon />
        <ListBoxItemLabel>Write</ListBoxItemLabel>
        <ListBoxItemDescription>Push branches and open pull requests.</ListBoxItemDescription>
      </ListBoxItem>
      <ListBoxItem id="maintain" textValue="Maintain" isDisabled>
        <ShieldCheckIcon />
        <ListBoxItemLabel>Maintain</ListBoxItemLabel>
        <ListBoxItemDescription>Manage the repository.</ListBoxItemDescription>
      </ListBoxItem>
      <ListBoxItem id="admin" textValue="Admin">
        <GlobeIcon />
        <ListBoxItemLabel>Admin</ListBoxItemLabel>
        <ListBoxItemDescription>Full access including settings.</ListBoxItemDescription>
      </ListBoxItem>
    </ListBox>
  </div>
)

export const Sections = () => (
  <div style={card}>
    <ListBox aria-label="Toppings" selectionMode="multiple" defaultSelectedKeys={['bbq', 'bacon']}>
      <ListBoxSection>
        <ListBoxSectionHeader>Sauces</ListBoxSectionHeader>
        <ListBoxItem id="signature">Signature sauce</ListBoxItem>
        <ListBoxItem id="bbq">BBQ sauce</ListBoxItem>
        <ListBoxItem id="honey-mustard">Honey mustard</ListBoxItem>
      </ListBoxSection>
      <ListBoxSection>
        <ListBoxSectionHeader>Extras</ListBoxSectionHeader>
        <ListBoxItem id="bacon">Bacon</ListBoxItem>
        <ListBoxItem id="onions">Sauteed onions</ListBoxItem>
      </ListBoxSection>
    </ListBox>
  </div>
)
