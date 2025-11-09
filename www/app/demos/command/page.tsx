import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
} from "@dotui/registry/ui/command";

export default function Page() {
  return (
    <Command className="w-80">
      <CommandInput placeholder="Type a command..." />
      <CommandContent>
        <CommandItem textValue="Create new file">
          Create new file...
        </CommandItem>
        <CommandItem textValue="Create new folder">
          Create new folder...
        </CommandItem>
        <CommandItem textValue="Open settings">Open settings</CommandItem>
      </CommandContent>
    </Command>
  );
}
