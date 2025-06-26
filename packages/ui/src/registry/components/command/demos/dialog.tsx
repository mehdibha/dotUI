"use client";

import { useFilter } from "react-aria-components";

import { Button } from "@dotui/ui/components/button";
import { Command } from "@dotui/ui/components/command";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { MenuContent, MenuItem } from "@dotui/ui/components/menu";
import { SearchField } from "@dotui/ui/components/search-field";

export default function Demo() {
  const { contains } = useFilter({ sensitivity: "base" });
  return (
    <DialogRoot>
      <Button>Open Dialog</Button>
      <Dialog className="p-0">
        <Command filter={contains} className="h-72 w-full">
          <div className="p-2">
            <SearchField
              placeholder="Search commands..."
              size="lg"
              autoFocus
              className="w-full"
            />
          </div>
          <MenuContent className="overflow-y-scroll">
            <MenuItem textValue="Create new file">Create new file...</MenuItem>
            <MenuItem textValue="Create new folder">
              Create new folder...
            </MenuItem>
            <MenuItem textValue="Assign to">Assign to...</MenuItem>
            <MenuItem textValue="Assign to me">Assign to me</MenuItem>
            <MenuItem textValue="Change status">Change status...</MenuItem>
            <MenuItem textValue="Change priority">Change priority...</MenuItem>
            <MenuItem textValue="Add label">Add label...</MenuItem>
            <MenuItem textValue="Remove label">Remove label...</MenuItem>
          </MenuContent>
        </Command>
      </Dialog>
    </DialogRoot>
  );
}
