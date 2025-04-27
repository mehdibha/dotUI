import { MenuIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import {
  Menu,
  MenuItem,
  MenuRoot,
  MenuSection,
} from "@/components/dynamic-core/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" shape="square">
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
