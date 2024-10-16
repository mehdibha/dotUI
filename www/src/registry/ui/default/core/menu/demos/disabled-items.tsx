import { Button } from "@/registry/ui/default/core/button";
import { Menu, MenuItem, MenuRoot } from "@/registry/ui/default/core/menu";
import { MenuIcon, PlusSquareIcon } from "@/__icons__";

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
