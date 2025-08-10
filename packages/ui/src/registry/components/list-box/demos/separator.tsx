import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Separator } from "@dotui/ui/components/separator";

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
