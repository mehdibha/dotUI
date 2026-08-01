import { ListBox, ListBoxItem } from '@/registry/ui/list-box'

export function ListBoxDemo() {
  return (
    <ListBox
      aria-label="Framework"
      selectionMode="single"
      defaultSelectedKeys={['nextjs']}
    >
      <ListBoxItem id="nextjs">Next.js</ListBoxItem>
      <ListBoxItem id="remix">Remix</ListBoxItem>
      <ListBoxItem id="astro">Astro</ListBoxItem>
      <ListBoxItem id="gatsby">Gatsby</ListBoxItem>
    </ListBox>
  )
}
