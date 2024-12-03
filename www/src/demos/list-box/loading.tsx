import { ListBox, Item } from "@/components/dynamic-core/list-box";

export default function Demo() {
  return (
    <ListBox isLoading>
      <Item>User 1</Item>
      <Item>User 2</Item>
      <Item>User 3</Item>
    </ListBox>
  );
}
