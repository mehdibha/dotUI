import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/ui/components/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Options" selectionMode="single">
      <ListBoxSection title="Permissions">
        <ListBoxItem label="Read" description="Read Only" />
        <ListBoxItem label="Write" description="Read and Write Only" />
        <ListBoxItem label="Admin" description="Full access" />
      </ListBoxSection>
    </ListBox>
  );
}
