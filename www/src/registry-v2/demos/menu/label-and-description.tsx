import { Button } from "@/components/dynamic-core/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-core/menu";
import { MenuIcon } from "@/__icons__";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" shape="square">
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
