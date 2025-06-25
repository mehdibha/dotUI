import { MenuIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot, MenuSub } from "@dotui/ui/components/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" shape="square">
        <MenuIcon />
      </Button>
      <Menu>
        <MenuItem>Account settings</MenuItem>
        <MenuSub>
          <MenuItem>Invite users</MenuItem>
          <Menu>
            <MenuItem>SMS</MenuItem>
            <MenuItem>Twitter</MenuItem>
            <MenuSub>
              <MenuItem>Email</MenuItem>
              <Menu>
                <MenuItem>Work</MenuItem>
                <MenuItem>Personal</MenuItem>
              </Menu>
            </MenuSub>
          </Menu>
        </MenuSub>
      </Menu>
    </MenuRoot>
  );
}
