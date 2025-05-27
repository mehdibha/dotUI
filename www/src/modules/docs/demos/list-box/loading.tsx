import { ListBox, ListBoxItem } from "@/components/dynamic-ui/list-box";

export default function Demo() {
  return (
    <ListBox isLoading>
      <ListBoxItem>User 1</ListBoxItem>
      <ListBoxItem>User 2</ListBoxItem>
      <ListBoxItem>User 3</ListBoxItem>
    </ListBox>
  );
}
