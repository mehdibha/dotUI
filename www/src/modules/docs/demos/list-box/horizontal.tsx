import { ListBox, ListBoxItem } from "@/components/dynamic-ui/list-box";

export default function Demo() {
  return (
    <ListBox
      aria-label="Options"
      orientation="horizontal"
      selectionMode="single"
    >
      <ListBoxItem textValue="Read" label="Read" description="Read Only" />
      <ListBoxItem
        textValue="Write"
        label="Write"
        description="Read and Write Only"
      />
      <ListBoxItem textValue="Admin" label="Admin" description="Full access" />
    </ListBox>
  );
}
