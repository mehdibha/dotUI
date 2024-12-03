import { Item, ListBox } from "@/registry/ui/default/core/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="project">
      <Item>View logs</Item>
      <Item>Manage domains</Item>
      <Item>Transfer project</Item>
      <Item variant="danger">Delete project</Item>
    </ListBox>
  );
}
