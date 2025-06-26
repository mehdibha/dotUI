import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Separator } from "@dotui/ui/components/separator";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline">File</Button>
      <Menu>
        <MenuItem>New...</MenuItem>
        <MenuItem>Badges</MenuItem>
        <Separator />
        <MenuItem>Save</MenuItem>
        <MenuItem>Save as...</MenuItem>
        <MenuItem>Rename...</MenuItem>
        <Separator />
        <MenuItem>Page setup…</MenuItem>
        <MenuItem>Print…</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
