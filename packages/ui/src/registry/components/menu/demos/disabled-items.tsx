import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { MenuIcon, PlusSquareIcon } from "@dotui/ui/icons";

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
