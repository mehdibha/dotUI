import {
  CopyIcon,
  MenuIcon,
  PlusSquareIcon,
  SquarePenIcon,
} from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/registry/ui/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default" shape="square" size="sm">
        <MenuIcon />
      </Button>
      <Menu>
        <MenuItem
          label="New file"
          description="Create a new file"
          prefix={<PlusSquareIcon />}
        />
        <MenuItem
          label="Copy link"
          description="Copy the file link"
          prefix={<CopyIcon />}
        />
        <MenuItem
          label="Edit file"
          description="Allows you to edit the file"
          prefix={<SquarePenIcon />}
        />
      </Menu>
    </MenuRoot>
  );
}
