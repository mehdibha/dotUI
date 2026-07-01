'use client'

import { useState } from 'react'

import { Input } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'

const members = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', role: 'Owner' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', role: 'Member' },
  { name: 'Isabella Nguyen', email: 'isabella.n@email.com', role: 'Member' },
  { name: 'William Kim', email: 'will.kim@email.com', role: 'Admin' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', role: 'Member' },
]

export default function Demo() {
  const [query, setQuery] = useState('')

  const results = members.filter((member) =>
    `${member.name} ${member.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  return (
    <div className="flex w-full max-w-xs flex-col gap-3 rounded-lg border bg-bg p-4">
      <SearchField
        aria-label="Search members"
        value={query}
        onChange={setQuery}
      >
        <Input placeholder="Filter members…" />
      </SearchField>
      <ul className="flex flex-col gap-1">
        {results.length === 0 ? (
          <li className="px-2 py-6 text-center text-sm text-fg-muted">
            No members found.
          </li>
        ) : (
          results.map((member) => (
            <li
              key={member.email}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{member.name}</p>
                <p className="truncate text-xs text-fg-muted">{member.email}</p>
              </div>
              <span className="shrink-0 text-xs text-fg-muted">
                {member.role}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
