import { Button } from "@/components/dynamic-ui/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-ui/menu";
import { MenuIcon, PlusSquareIcon } from "lucide-react";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" shape="square">
        <MenuIcon />
      </Button>
      <Menu>
        <MenuItem>Account settings</MenuItem>
        <MenuItem prefix={<PlusSquareIcon />} isDisabled>
          Create team
        </MenuItem>
        <MenuItem>Log out</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
