import { MenuIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { MenuContent, MenuItem, MenuRoot } from "@/components/dynamic-ui/menu";
import { Overlay } from "@/components/dynamic-ui/overlay";

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
