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
        <MenuItem>Account settings</MenuItem>
        <MenuItem>Create team</MenuItem>
        <MenuItem>Command menu</MenuItem>
        <MenuItem variant="danger">Delete</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
