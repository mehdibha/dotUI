import { ListBox, ListBoxItem } from "@/components/dynamic-ui/list-box";
import { Separator } from "@/components/dynamic-ui/separator";

export default function Demo() {
  return (
    <ListBox aria-label="File">
      <ListBoxItem>New...</ListBoxItem>
      <ListBoxItem>Badges</ListBoxItem>
      <Separator />
      <ListBoxItem>Save</ListBoxItem>
      <ListBoxItem>Save as...</ListBoxItem>
      <ListBoxItem>Rename...</ListBoxItem>
      <Separator />
      <ListBoxItem>Page setup…</ListBoxItem>
      <ListBoxItem>Print…</ListBoxItem>
    </ListBox>
  );
}
