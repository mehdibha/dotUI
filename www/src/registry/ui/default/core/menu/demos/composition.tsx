import { Button } from "@/registry/ui/default/core/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
} from "@/registry/ui/default/core/menu";
import { Overlay } from "@/registry/ui/default/core/overlay";
import { MenuIcon } from "@/__icons__";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" shape="square">
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
