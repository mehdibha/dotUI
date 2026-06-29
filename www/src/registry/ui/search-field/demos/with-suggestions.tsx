'use client'

import { useState } from 'react'

import { Input } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'

const cities = [
  'San Francisco',
  'San Diego',
  'San Jose',
  'Sacramento',
  'Seattle',
  'Austin',
  'Boston',
  'Denver',
]

export default function Demo() {
  const [query, setQuery] = useState('')

  const suggestions = query
    ? cities.filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    : []

  return (
    <div className="w-full max-w-xs">
      <SearchField aria-label="Search cities" value={query} onChange={setQuery}>
        <Input placeholder="Search cities…" />
      </SearchField>
      {suggestions.length > 0 && (
        <ul className="mt-2 overflow-hidden rounded-md border bg-bg shadow-md">
          {suggestions.map((city) => (
            <li key={city}>
              <button
                type="button"
                onClick={() => setQuery(city)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
