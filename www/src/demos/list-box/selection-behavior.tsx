import { ListBox, Item } from "@/components/dynamic-core/list-box";

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
