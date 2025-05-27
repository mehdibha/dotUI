import { ListBox, ListBoxItem } from "@/components/dynamic-ui/list-box";

export default function Demo() {
  return (
    <div className="flex items-start gap-10">
      <ListBox aria-label="Framework" selectionMode="single">
        <ListBoxItem>Next.js</ListBoxItem>
        <ListBoxItem>Remix</ListBoxItem>
        <ListBoxItem>Astro</ListBoxItem>
        <ListBoxItem>Gatsby</ListBoxItem>
      </ListBox>
      <ListBox aria-label="Framework" selectionMode="multiple">
        <ListBoxItem>Next.js</ListBoxItem>
        <ListBoxItem>Remix</ListBoxItem>
        <ListBoxItem>Astro</ListBoxItem>
        <ListBoxItem>Gatsby</ListBoxItem>
      </ListBox>
    </div>
  );
}
