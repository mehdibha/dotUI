import { MenuIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-core/menu";

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
