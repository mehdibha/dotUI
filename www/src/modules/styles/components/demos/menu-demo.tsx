import React from "react";
import { CopyIcon, TrashIcon, EditIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-ui/menu";

export function MenuDemo() {
  return (
    <div className="flex gap-4">
      <MenuRoot>
        <Button>Open Menu</Button>
        <Menu>
          <MenuItem textValue="Copy">
            <CopyIcon className="mr-2 size-4" />
            Copy
          </MenuItem>
          <MenuItem textValue="Edit">
            <EditIcon className="mr-2 size-4" />
            Edit
          </MenuItem>
          <MenuItem textValue="Delete" className="text-danger">
            <TrashIcon className="mr-2 size-4" />
            Delete
          </MenuItem>
        </Menu>
      </MenuRoot>
    </div>
  );
}
