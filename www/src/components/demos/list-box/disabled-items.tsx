import { ListBox, ListBoxItem } from "@/components/dynamic-core/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Favorite framework" selectionMode="single">
      <ListBoxItem>Next.js</ListBoxItem>
      <ListBoxItem>Remix</ListBoxItem>
      <ListBoxItem isDisabled>Gatsby</ListBoxItem>
      <ListBoxItem>Astro</ListBoxItem>
    </ListBox>
  );
}
