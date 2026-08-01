import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
} from '@/registry/ui/command'

const ITEMS = ['Create new file...', 'Create new folder...', 'Open settings']

export function CommandDemo() {
  return (
    <Command className="w-60">
      <CommandInput
        aria-label="Search commands"
        placeholder="Type a command..."
        className="w-full"
      />
      <CommandContent className="h-30">
        {ITEMS.map((item) => (
          <CommandItem key={item} textValue={item}>
            {item}
          </CommandItem>
        ))}
      </CommandContent>
    </Command>
  )
}
