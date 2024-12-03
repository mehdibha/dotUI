import { Button } from "@/components/dynamic-core/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-core/menu";
import { MenuIcon } from "@/__icons__";

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
