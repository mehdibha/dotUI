import { MenuIcon, PlusSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/registry/ui/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default" shape="square">
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
