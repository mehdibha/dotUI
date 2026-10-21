import { ListBox, ListBoxItem } from "@/registry/ui/list-box"

export default function Demo() {
  return (
    <ListBox aria-label="Framework" onAction={() => {}}>
      <ListBoxItem>Next.js</ListBoxItem>
      <ListBoxItem>Remix</ListBoxItem>
      <ListBoxItem>Astro</ListBoxItem>
      <ListBoxItem>Gatsby</ListBoxItem>
    </ListBox>
  )
}
