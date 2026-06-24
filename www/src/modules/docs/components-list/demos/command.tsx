'use client'

import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
} from '@/registry/ui/command'

import { useTypewriter } from '../autoplay'

// Command's own autocomplete filter can't be driven through props (its
// `inputValue` doesn't reach the wrapped Autocomplete), so we type into the
// controlled input — a `value` prop wins over the autocomplete's internal
// state — and filter the visible items ourselves to mirror the live filtering.
const ITEMS = ['Create new file...', 'Create new folder...', 'Open settings']

export function CommandDemo() {
  const { value } = useTypewriter('settings')
  const query = value.trim().toLowerCase()
  const visible = ITEMS.filter((item) => item.toLowerCase().includes(query))
  return (
    <Command className="w-60">
      <CommandInput
        aria-label="Search commands"
        placeholder="Type a command..."
        className="w-full"
        value={value}
        onChange={() => {}}
      />
      <CommandContent className="h-30">
        {visible.map((item) => (
          <CommandItem key={item} textValue={item}>
            {item}
          </CommandItem>
        ))}
      </CommandContent>
    </Command>
  )
}
