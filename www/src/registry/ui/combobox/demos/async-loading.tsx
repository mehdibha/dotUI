'use client'

import { ChevronDownIcon } from 'lucide-react'
import { useAsyncList } from 'react-stately'

import { Button } from '@/registry/ui/button'
import { Combobox } from '@/registry/ui/combobox'
import { Label } from '@/registry/ui/field'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'

interface Character {
  name: string
}

export default function Demo() {
  const list = useAsyncList<Character>({
    async load({ signal }) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon`, { signal })
      const json = (await res.json()) as { results: Character[] }
      return {
        items: json.results,
      }
    },
  })

  return (
    <Combobox>
      <Label>Pokemon</Label>
      <InputGroup>
        <Input />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly>
            <ChevronDownIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <ListBox items={list.items} isLoading={list.isLoading}>
          {(item) => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBox>
      </Popover>
    </Combobox>
  )
}
