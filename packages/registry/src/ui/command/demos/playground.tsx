"use client";

import type { Control } from "@dotui/registry/playground";

import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
  CommandSection,
  CommandSectionHeader,
} from "../index";

interface CommandPlaygroundProps {
  placeholder?: string;
}

export function CommandPlayground({
  placeholder = "Type a command...",
}: CommandPlaygroundProps) {
  return (
    <Command className="w-[300px]">
      <CommandInput placeholder={placeholder} />
      <CommandContent>
        <CommandSection>
          <CommandSectionHeader>Actions</CommandSectionHeader>
          <CommandItem textValue="Create new file">Create new file</CommandItem>
          <CommandItem textValue="Create new folder">Create new folder</CommandItem>
          <CommandItem textValue="Open file">Open file</CommandItem>
        </CommandSection>
      </CommandContent>
    </Command>
  );
}

export const commandControls: Control[] = [
  {
    type: "string",
    name: "placeholder",
    label: "Placeholder",
    defaultValue: "Type a command...",
  },
];

