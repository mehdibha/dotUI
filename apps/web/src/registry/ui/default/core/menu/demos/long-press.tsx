import { MenuIcon } from "@/__icons__";
import { Button } from "@/registry/ui/default/core/button";
import { Menu, MenuItem, MenuRoot } from "@/registry/ui/default/core/menu";

export default function Demo() {
  return (
    <MenuRoot trigger="longPress">
      <Button variant="outline" shape="square">
        <MenuIcon />
      </Button>
      <Menu>
        <MenuItem>Account settings</MenuItem>
        <MenuItem>Create team</MenuItem>
        <MenuItem>Log out</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
