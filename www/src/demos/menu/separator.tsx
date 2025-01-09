import { Button } from "@/components/dynamic-core/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-core/menu";
import { Separator } from "@/components/dynamic-core/separator";

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
