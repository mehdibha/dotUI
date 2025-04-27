import { Button } from "@/components/dynamic-ui/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-ui/menu";
import { Separator } from "@/components/dynamic-ui/separator";

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
