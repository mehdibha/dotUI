import { Button } from "@/components/dynamic-core/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-core/menu";
import { Section } from "@/components/dynamic-core/section";
import { MenuIcon } from "@/__icons__";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" shape="square">
        <MenuIcon />
      </Button>
      <Menu>
        <Section title="Notifications">
          <MenuItem>Push notifications</MenuItem>
          <MenuItem>Badges</MenuItem>
        </Section>
        <Section title="Panels">
          <MenuItem id="console">Console</MenuItem>
          <MenuItem>Search</MenuItem>
        </Section>
      </Menu>
    </MenuRoot>
  );
}
