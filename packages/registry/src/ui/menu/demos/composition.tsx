import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { MenuContent, MenuItem, MenuRoot } from "@dotui/registry/ui/menu";
import { Overlay } from "@dotui/registry/ui/overlay";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default" shape="square">
        <MenuIcon />
      </Button>
      <Overlay type="popover" mobileType="drawer">
        <MenuContent>
          <MenuItem>Account settings</MenuItem>
          <MenuItem>Create team</MenuItem>
          <MenuItem>Command menu</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Overlay>
    </MenuRoot>
  );
}
