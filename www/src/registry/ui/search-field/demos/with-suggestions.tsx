"use client"

import React from "react"
import { Autocomplete, useFilter } from "react-aria-components/Autocomplete"

import { Input } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"

const cities = [
  "San Francisco",
  "San Diego",
  "San Jose",
  "Sacramento",
  "Seattle",
  "Austin",
  "Boston",
  "Denver",
].map((name) => ({ name }))

export default function Demo() {
  const { contains } = useFilter({ sensitivity: "base" })
  const [query, setQuery] = React.useState("")
  const [isOpen, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const popoverRef = React.useRef<HTMLDivElement>(null)

  return (
    <Autocomplete
      filter={contains}
      inputValue={query}
      onInputChange={(value) => {
        setQuery(value)
        setOpen(value.length > 0)
      }}
    >
      <SearchField
        ref={triggerRef}
        aria-label="Search cities"
        onBlur={(e) => {
          if (!popoverRef.current?.contains(e.relatedTarget as Node)) {
            setOpen(false)
          }
        }}
        className="w-full max-w-xs"
      >
        <Input placeholder="Search cities…" />
      </SearchField>
      <Popover
        ref={popoverRef}
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setOpen}
        isNonModal
        trigger="ComboBox"
        placement="bottom start"
        showArrow={false}
      >
        <ListBox
          aria-label="Suggestions"
          items={cities}
          onAction={(key) => {
            setQuery(String(key))
            setOpen(false)
          }}
          renderEmptyState={() => (
            <p className="p-2 text-sm text-fg-muted">No cities found.</p>
          )}
        >
          {(city) => <ListBoxItem id={city.name}>{city.name}</ListBoxItem>}
        </ListBox>
      </Popover>
    </Autocomplete>
  )
}
