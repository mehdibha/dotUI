import { ListBox, ListBoxItem } from "@/components/dynamic-core/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Framework" layout="grid">
      <ListBoxItem>Next.js</ListBoxItem>
      <ListBoxItem>Remix</ListBoxItem>
      <ListBoxItem>Astro</ListBoxItem>
      <ListBoxItem>Gatsby</ListBoxItem>
    </ListBox>
  );
}
