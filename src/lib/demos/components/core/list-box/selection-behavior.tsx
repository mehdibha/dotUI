import { ListBox, ListBoxItem } from "@/lib/components/core/default/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Framework" selectionMode="multiple" selectionBehavior="replace">
      <ListBoxItem>Next.js</ListBoxItem>
      <ListBoxItem>Remix</ListBoxItem>
      <ListBoxItem>Astro</ListBoxItem>
      <ListBoxItem>Gatsby</ListBoxItem>
    </ListBox>
  );
}
