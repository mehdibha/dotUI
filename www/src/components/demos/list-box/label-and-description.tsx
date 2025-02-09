import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@/components/dynamic-core/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Options" selectionMode="single">
      <ListBoxSection title="Permissions">
        <ListBoxItem textValue="Read" label="Read" description="Read Only" />
        <ListBoxItem
          textValue="Write"
          label="Write"
          description="Read and Write Only"
        />
        <ListBoxItem
          textValue="Admin"
          label="Admin"
          description="Full access"
        />
      </ListBoxSection>
    </ListBox>
  );
}
