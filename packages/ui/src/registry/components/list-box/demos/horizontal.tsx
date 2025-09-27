import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";

export default function Demo() {
  return (
    <ListBox
      aria-label="Options"
      orientation="horizontal"
      selectionMode="single"
    >
      <ListBoxItem label="Read" description="Read Only" />
      <ListBoxItem label="Write" description="Read and Write Only" />
      <ListBoxItem label="Admin" description="Full access" />
    </ListBox>
  );
}
