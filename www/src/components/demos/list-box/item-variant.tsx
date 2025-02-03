import { ListBox, ListBoxItem } from "@/components/dynamic-core/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="project">
      <ListBoxItem>View logs</ListBoxItem>
      <ListBoxItem>Manage domains</ListBoxItem>
      <ListBoxItem>Transfer project</ListBoxItem>
      <ListBoxItem variant="danger">Delete project</ListBoxItem>
    </ListBox>
  );
}
