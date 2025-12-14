import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
  return (
    <Menu>
      <Button variant="default" aspect="square">
        <MenuIcon />
      </Button>
      <Popover>
        <MenuContent>
          <MenuSection>
            <MenuSectionHeader>Notifications</MenuSectionHeader>
            <MenuItem>Push notifications</MenuItem>
            <MenuItem>Badges</MenuItem>
          </MenuSection>
          <MenuSection>
            <MenuSectionHeader>Panels</MenuSectionHeader>
            <MenuItem id="console">Console</MenuItem>
            <MenuItem>Search</MenuItem>
          </MenuSection>
        </MenuContent>
      </Popover>
    </Menu>
  );
}
