"use client";

import { Command } from "@/components/dynamic-ui/command";
import { MenuContent, MenuItem } from "@/components/dynamic-ui/menu";
import { SearchField } from "@/components/dynamic-ui/search-field";
import { useFilter } from "react-aria-components";

export default function Demo() {
  const { contains } = useFilter({ sensitivity: "base" });
  return (
    <Command filter={contains}>
      <SearchField placeholder="Search commands..." />
      <MenuContent className="min-h-48">
        <MenuItem textValue="Create new file">Create new file...</MenuItem>
        <MenuItem textValue="Create new folder">Create new folder...</MenuItem>
        <MenuItem textValue="Assign to">Assign to...</MenuItem>
        <MenuItem textValue="Assign to me">Assign to me</MenuItem>
        <MenuItem textValue="Change status">Change status...</MenuItem>
        <MenuItem textValue="Change priority">Change priority...</MenuItem>
        <MenuItem textValue="Add label">Add label...</MenuItem>
        <MenuItem textValue="Remove label">Remove label...</MenuItem>
      </MenuContent>
    </Command>
  );
}
