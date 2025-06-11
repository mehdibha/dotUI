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
        <MenuItem>Account settings</MenuItem>
        <MenuItem>Create team</MenuItem>
        <MenuItem>Command menu</MenuItem>
        <MenuItem variant="danger">Delete</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
