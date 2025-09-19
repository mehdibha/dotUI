import { Button } from "@dotui/ui/components/button";
import { MenuContent, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Overlay } from "@dotui/ui/components/overlay";
import { MenuIcon } from "@dotui/ui/icons";

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
