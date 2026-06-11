'use client'

import { useAsyncList } from 'react-stately'

import { Loader } from '@/registry/ui/loader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

interface Pokemon {
  name: string
}

export default function Demo() {
  const list = useAsyncList<Pokemon>({
    async load({ signal, cursor }) {
      const res = await fetch(cursor || `https://pokeapi.co/api/v2/pokemon`, {
        signal,
      })
      const json = await res.json()

      return {
        items: json.results,
        cursor: json.next,
      }
    },
  })

  return (
    <Select aria-label="Pokemon">
      <SelectTrigger />
      <SelectContent
        className="max-h-64 overflow-auto overscroll-none"
        items={list.items}
        isLoading={list.loadingState === 'loadingMore'}
        onLoadMore={list.loadMore}
        renderEmptyState={() => (
          <div className="flex items-center justify-center py-4">
            <Loader />
          </div>
        )}
      >
        {(item) => (
          <SelectItem id={item.name} className="capitalize">
            {item.name}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
