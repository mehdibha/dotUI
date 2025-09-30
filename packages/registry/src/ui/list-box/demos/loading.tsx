import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Users" isLoading>
      <ListBoxItem>User 1</ListBoxItem>
      <ListBoxItem>User 2</ListBoxItem>
      <ListBoxItem>User 3</ListBoxItem>
    </ListBox>
  );
}
