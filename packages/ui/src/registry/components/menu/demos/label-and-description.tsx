import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { MenuIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default" shape="square">
        <MenuIcon />
      </Button>
      <Menu>
        <MenuItem label="New file" description="Create a new file" />
        <MenuItem label="Copy link" description="Copy the file link" />
        <MenuItem label="Edit file" description="Allows you to edit the file" />
      </Menu>
    </MenuRoot>
  );
}
