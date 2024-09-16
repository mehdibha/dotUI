import { ListBox, Item } from "@/registry/ui/default/core/list-box";

export default function Demo() {
  return (
    <ListBox
      aria-label="Framework"
      selectionMode="multiple"
      selectionBehavior="replace"
    >
      <Item>Next.js</Item>
      <Item>Remix</Item>
      <Item>Astro</Item>
      <Item>Gatsby</Item>
    </ListBox>
  );
}