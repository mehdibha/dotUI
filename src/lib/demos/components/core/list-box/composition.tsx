import { ListBox, ListBoxItem } from "@/lib/components/core/default/list-box";
import { Text } from "@/lib/components/core/default/text";

export default function Demo() {
  return (
    <ListBox aria-label="Framework" selectionMode="multiple" className="w-60">
      <ListBoxItem>
        <Text slot="label">Next.js</Text>
        <Text slot="description">React-based SSR and static site framework.</Text>
      </ListBoxItem>
      <ListBoxItem>
        <Text slot="label">Remix</Text>
        <Text slot="description">Full-stack framework with efficient data loading.</Text>
      </ListBoxItem>
      <ListBoxItem>
        <Text slot="label">Astro</Text>
        <Text slot="description">Lightweight static site builder for performance.</Text>
      </ListBoxItem>
    </ListBox>
  );
}
