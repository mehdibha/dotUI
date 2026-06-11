import { ListBox, ListBoxItem } from '@/registry/ui/list-box'

export default function Demo() {
  return (
    <div className="rounded-md border bg-card shadow-sm">
      <ListBox
        aria-label="Plan"
        selectionMode="single"
        disabledKeys={['enterprise', 'support']}
      >
        <ListBoxItem id="hobby">Hobby</ListBoxItem>
        <ListBoxItem id="pro">Pro</ListBoxItem>
        <ListBoxItem id="enterprise">Enterprise (sold out)</ListBoxItem>
        <ListBoxItem id="support">Premium support (coming soon)</ListBoxItem>
      </ListBox>
    </div>
  )
}
