import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { MenuIcon } from "@dotui/ui/icons";

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
