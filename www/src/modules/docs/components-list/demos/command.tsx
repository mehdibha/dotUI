import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
} from '@/registry/ui/command'

export function CommandDemo() {
  return (
    <Command className="w-60">
      <CommandInput
        aria-label="Search commands"
        placeholder="Type a command..."
        className="w-full"
      />
      <CommandContent className="h-30">
        <CommandItem textValue="Create new file">
          Create new file...
        </CommandItem>
        <CommandItem textValue="Create new folder">
          Create new folder...
        </CommandItem>
        <CommandItem textValue="Open settings">Open settings</CommandItem>
      </CommandContent>
    </Command>
  )
}
