import { Button } from "@/components/dynamic-ui/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-ui/menu";
import {
  CopyIcon,
  MenuIcon,
  PlusSquareIcon,
  SquarePenIcon,
} from "lucide-react";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" shape="square" size="sm">
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
