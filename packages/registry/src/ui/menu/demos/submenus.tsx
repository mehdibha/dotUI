import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuItem, MenuRoot, MenuSub } from "@dotui/registry/ui/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default" shape="square">
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
