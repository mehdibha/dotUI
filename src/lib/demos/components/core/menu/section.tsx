import { Button } from "@/lib/components/core/default/button";
import {
  Menu,
  MenuItem,
  MenuRoot,
  MenuSection,
} from "@/lib/components/core/default/menu";
import { Separator } from "@/lib/components/core/default/separator";

export default function Demo() {
  return (
    <MenuRoot>
      <Button>Settings</Button>
      <Menu>
        <MenuSection title="Notifications">
          <MenuItem>Push notifications</MenuItem>
          <MenuItem>Badges</MenuItem>
        </MenuSection>
        <Separator />
        <MenuSection title="Panels">
          <MenuItem id="console">Console</MenuItem>
          <MenuItem>Search</MenuItem>
        </MenuSection>
      </Menu>
    </MenuRoot>
  );
}
