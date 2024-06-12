import { Button } from "@/lib/components/core/default/button";
import { Menu, MenuItem, MenuRoot } from "@/lib/components/core/default/menu";

export default function Demo() {
  return (
    <MenuRoot trigger="longPress">
      <Button>Settings</Button>
      <Menu>
        <MenuItem>Account settings</MenuItem>
        <MenuItem>Create team</MenuItem>
        <MenuItem>Command menu</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
