"use client";

import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
} from "@dotui/registry/ui/command";

export default function Demo() {
  return (
    <Command>
      <CommandInput />
      <CommandContent className="min-h-48">
        <CommandItem textValue="Create new file">
          Create new file...
        </CommandItem>
        <CommandItem textValue="Create new folder">
          Create new folder...
        </CommandItem>
        <CommandItem textValue="Assign to">Assign to...</CommandItem>
        <CommandItem textValue="Assign to me">Assign to me</CommandItem>
        <CommandItem textValue="Change status">Change status...</CommandItem>
        <CommandItem textValue="Change priority">
          Change priority...
        </CommandItem>
        <CommandItem textValue="Add label">Add label...</CommandItem>
        <CommandItem textValue="Remove label">Remove label...</CommandItem>
      </CommandContent>
    </Command>
  );
}
