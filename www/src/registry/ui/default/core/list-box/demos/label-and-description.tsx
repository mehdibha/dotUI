import { ListBox, Item } from "@/registry/ui/default/core/list-box";
import { Section } from "@/registry/ui/default/core/section";

export default function Demo() {
  return (
    <ListBox aria-label="Options" selectionMode="single">
      <Section title="Permissions">
        <Item textValue="Read" label="Read" description="Read Only" />
        <Item
          textValue="Write"
          label="Write"
          description="Read and Write Only"
        />
        <Item textValue="Admin" label="Admin" description="Full access" />
      </Section>
    </ListBox>
  );
}
