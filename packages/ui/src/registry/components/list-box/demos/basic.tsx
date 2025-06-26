import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Framework">
      <ListBoxItem>Next.js</ListBoxItem>
      <ListBoxItem>Remix</ListBoxItem>
      <ListBoxItem>Astro</ListBoxItem>
      <ListBoxItem>Gatsby</ListBoxItem>
    </ListBox>
  );
}
