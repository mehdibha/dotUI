import { Button } from "@/components/dynamic-ui/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-ui/menu";
import { MenuIcon } from "lucide-react";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" shape="square">
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
