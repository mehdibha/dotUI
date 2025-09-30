import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/registry/ui/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default" shape="square">
        <MenuIcon />
      </Button>
      <Menu>
        <MenuItem shortcut="⌘N">New file</MenuItem>
        <MenuItem shortcut="⌘C">Copy link</MenuItem>
        <MenuItem shortcut="⌘⇧E">Edit file</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
