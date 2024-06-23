import { Button } from "@/lib/components/core/default/button";
import { Menu, MenuItem, MenuRoot, MenuSub } from "@/lib/components/core/default/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button>Settings</Button>
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
