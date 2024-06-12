import { Button } from "@/lib/components/core/default/button";
import { Menu, MenuItem, MenuRoot } from "@/lib/components/core/default/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button>Settings</Button>
      <Menu>
        <MenuItem isDisabled>Account settings</MenuItem>
        <MenuItem>Create team</MenuItem>
        <MenuItem isDisabled>Command menu</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
