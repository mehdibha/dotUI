import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";
import { Separator } from "@dotui/registry/ui/separator";

export default function Demo() {
  return (
    <Menu>
      <Button variant="default">File</Button>
      <Popover>
        <MenuContent>
          <MenuItem>New...</MenuItem>
          <MenuItem>Badges</MenuItem>
          <Separator />
          <MenuItem>Save</MenuItem>
          <MenuItem>Save as...</MenuItem>
          <MenuItem>Rename...</MenuItem>
          <Separator />
          <MenuItem>Page setup…</MenuItem>
          <MenuItem>Print…</MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  );
}
