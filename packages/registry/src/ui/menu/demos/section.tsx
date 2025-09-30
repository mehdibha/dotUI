import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuItem, MenuRoot, MenuSection } from "@dotui/registry/ui/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default" shape="square">
        <MenuIcon />
      </Button>
      <Menu>
        <MenuSection title="Notifications">
          <MenuItem>Push notifications</MenuItem>
          <MenuItem>Badges</MenuItem>
        </MenuSection>
        <MenuSection title="Panels">
          <MenuItem id="console">Console</MenuItem>
          <MenuItem>Search</MenuItem>
        </MenuSection>
      </Menu>
    </MenuRoot>
  );
}
