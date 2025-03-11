import { MenuIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
} from "@/components/dynamic-core/menu";
import { Overlay } from "@/components/dynamic-core/overlay";

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
