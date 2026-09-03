import { ListBox, ListBoxItem } from "@/registry/ui/list-box"

import { Surface } from "../overlay"

export function ListBoxDemo() {
  return (
    <Surface variant="menu" className="w-44 p-0">
      <ListBox
        aria-label="Framework"
        selectionMode="single"
        defaultSelectedKeys={["remix"]}
        className="border-0 bg-transparent shadow-none"
      >
        <ListBoxItem id="nextjs">Next.js</ListBoxItem>
        <ListBoxItem id="remix">Remix</ListBoxItem>
        <ListBoxItem id="astro">Astro</ListBoxItem>
        <ListBoxItem id="gatsby">Gatsby</ListBoxItem>
      </ListBox>
    </Surface>
  )
}
