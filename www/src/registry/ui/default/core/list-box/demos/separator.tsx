import { ListBox, Item } from "@/registry/ui/default/core/list-box";
import { Separator } from "@/registry/ui/default/core/separator";

export default function Demo() {
  return (
    <ListBox aria-label="File">
      <Item>New...</Item>
      <Item>Badges</Item>
      <Separator />
      <Item>Save</Item>
      <Item>Save as...</Item>
      <Item>Rename...</Item>
      <Separator />
      <Item>Page setup…</Item>
      <Item>Print…</Item>
    </ListBox>
  );
}
