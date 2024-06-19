import { ListBox, ListBoxItem } from "@/lib/components/core/default/list-box";
import { Section } from "@/lib/components/core/default/section";

export default function Demo() {
  return (
    <ListBox aria-label="Options" orientation="horizontal" selectionMode="single">
      <ListBoxItem textValue="Read" label="Read" description="Read Only" />
      <ListBoxItem textValue="Write" label="Write" description="Read and Write Only" />
      <ListBoxItem textValue="Admin" label="Admin" description="Full access" />
    </ListBox>
  );
}
