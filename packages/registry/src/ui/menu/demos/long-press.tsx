import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
  return (
    <Menu trigger="longPress">
      <Button variant="default" aspect="square">
        <MenuIcon />
      </Button>
      <Popover>
        <MenuContent>
          <MenuItem>Account settings</MenuItem>
          <MenuItem>Create team</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  );
}
