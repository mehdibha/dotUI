import { Button } from "@/components/dynamic-core/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-core/menu";
import { MenuIcon } from "@/__icons__";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" shape="square">
        <MenuIcon />
      </Button>
      <Menu>
        <MenuItem>Account settings</MenuItem>
        <MenuItem>Create team</MenuItem>
        <MenuItem>Command menu</MenuItem>
        <MenuItem variant="danger">Delete</MenuItem>
      </Menu>
    </MenuRoot>
  );
}