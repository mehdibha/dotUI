import { Button } from "@/lib/components/core/default/button";
import { Menu, MenuItem, MenuRoot } from "@/lib/components/core/default/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button>Settings</Button>
      <Menu>
        <MenuItem label="New file" description="Create a new file" />
        <MenuItem label="Copy link" description="Copy the file link" />
        <MenuItem label="Edit file" description="Allows you to edit the file" />
      </Menu>
    </MenuRoot>
  );
}
