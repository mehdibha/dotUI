import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";

export default function Page() {
  return (
    <ListBox aria-label="Framework">
      <ListBoxItem>Next.js</ListBoxItem>
      <ListBoxItem>Remix</ListBoxItem>
      <ListBoxItem>Astro</ListBoxItem>
      <ListBoxItem>Gatsby</ListBoxItem>
    </ListBox>
  );
}

