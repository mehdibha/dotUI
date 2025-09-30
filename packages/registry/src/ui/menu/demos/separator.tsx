import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/registry/ui/menu";
import { Separator } from "@dotui/registry/ui/separator";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default">File</Button>
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
