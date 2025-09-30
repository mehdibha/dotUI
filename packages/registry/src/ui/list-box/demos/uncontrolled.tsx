import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";

export default function Demo() {
  return (
    <ListBox
      aria-label="Framework"
      selectionMode="multiple"
      defaultSelectedKeys={["nextjs", "remix", "astro"]}
    >
      <ListBoxItem id="nextjs">Next.js</ListBoxItem>
      <ListBoxItem id="remix">Remix</ListBoxItem>
      <ListBoxItem id="astro">Astro</ListBoxItem>
      <ListBoxItem id="gatsby">Gatsby</ListBoxItem>
    </ListBox>
  );
}
